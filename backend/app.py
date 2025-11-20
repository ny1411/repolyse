import google.generativeai as genai
from transformers import AutoTokenizer, AutoModel, T5Tokenizer, T5ForConditionalGeneration, RobertaTokenizer, RobertaForSequenceClassification, DistilBertTokenizer, DistilBertForSequenceClassification
import torch
import github3
import json
import numpy as np
from torch.utils.data import Dataset, DataLoader
from tqdm import tqdm
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import hashlib
import zipfile
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# Gemini API Setup
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Warning: GEMINI_API_KEY not found in environment variables.")
genai.configure(api_key=api_key)
gemini_client = genai.GenerativeModel("gemini-2.5-flash")

# Load Models
codebert_tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
codebert_model = AutoModel.from_pretrained("microsoft/codebert-base")
roberta_tokenizer = RobertaTokenizer.from_pretrained("roberta-base")
roberta_model = RobertaForSequenceClassification.from_pretrained("roberta-base", num_labels=2)
distilbert_tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
distilbert_model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)
t5_tokenizer = T5Tokenizer.from_pretrained("t5-small")
t5_model = T5ForConditionalGeneration.from_pretrained("t5-small")

# Fine-Tune RoBERTa
class FineTuneDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    def __len__(self):
        return len(self.texts)
    def __getitem__(self, idx):
        encoding = self.tokenizer(self.texts[idx], truncation=True, padding="max_length", max_length=self.max_length, return_tensors="pt")
        return {
            "input_ids": encoding["input_ids"].squeeze(),
            "attention_mask": encoding["attention_mask"].squeeze(),
            "labels": torch.tensor(self.labels[idx], dtype=torch.long)
        }

roberta_texts = ["Great fix!", "This is a mess", "Nice work", "Terrible bug"]
roberta_labels = [1, 0, 1, 0]
roberta_dataset = FineTuneDataset(roberta_texts, roberta_labels, roberta_tokenizer)
roberta_loader = DataLoader(roberta_dataset, batch_size=2, shuffle=True)
optimizer = torch.optim.AdamW(roberta_model.parameters(), lr=5e-5)
roberta_model.train()
for epoch in range(2):
    for batch in roberta_loader:
        outputs = roberta_model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

# Fine-Tune DistilBERT
distilbert_texts = ["eval(input())", "print('hello')", "exec('code')", "x = 5"]
distilbert_labels = [1, 0, 1, 0]
distilbert_dataset = FineTuneDataset(distilbert_texts, distilbert_labels, distilbert_tokenizer)
distilbert_loader = DataLoader(distilbert_dataset, batch_size=2, shuffle=True)
optimizer = torch.optim.AdamW(distilbert_model.parameters(), lr=5e-5)
distilbert_model.train()
for epoch in range(2):
    for batch in distilbert_loader:
        outputs = distilbert_model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

roberta_model.eval()
distilbert_model.eval()

progress = {"status": "idle", "current_file": "", "total_files": 0, "processed_files": 0}

def fetch_repo_data(repo_url, github_token=None):
    parts = repo_url.split('/')
    owner, repo_name = parts[-2], parts[-1]
    
    if github_token:
        gh = github3.login(token=github_token)
    else:
        gh = github3.GitHub()
        
    try:
        repo = gh.repository(owner, repo_name)
        if not repo:
            raise Exception("Repository not found or access denied")
    except Exception as e:
        raise Exception(f"Error accessing repository: {e}")

    metadata = {"name": repo.name, "description": repo.description, "stars": repo.stargazers_count, "language": repo.language}
    code_files = {}
    def fetch_directory(path=""):
        try:
            contents = repo.directory_contents(path, return_as=dict)
            for filename, file_obj in contents.items():
                full_path = f"{path}{filename}"
                if file_obj.type == "file" and filename.endswith((".py", ".js", ".c",".kt", ".java", ".cpp", ".h", ".ts", ".tsx", ".jsx")):
                    if file_obj.decoded:
                        try:
                            content = file_obj.decoded.decode("utf-8")
                            last_commit = repo.file_contents(full_path).last_modified
                            code_files[full_path] = {"content": content, "size": len(content), "last_commit": last_commit}
                        except:
                            print(f"Skipping {full_path}: Unable to decode")
                    else:
                        try:
                            file_content = repo.file_contents(full_path)
                            content = file_content.decoded.decode("utf-8")
                            last_commit = file_content.last_modified
                            code_files[full_path] = {"content": content, "size": len(content), "last_commit": last_commit}
                        except Exception as e:
                            print(f"Skipping {full_path}: {e}")
                elif file_obj.type == "dir":
                    fetch_directory(f"{full_path}/")
        except Exception as e:
            print(f"Error fetching {path}: {e}")
    fetch_directory()
    return metadata, code_files

def chunk_code(code_snippet, chunk_size=300, overlap=50):
    chunks = []
    for i in range(0, len(code_snippet), chunk_size - overlap):
        chunk = code_snippet[i:i + chunk_size]
        if chunk:
            chunks.append(chunk)
    return chunks

def gemini_summarize(code_snippet, file_path):
    prompt = f"You are an expert developer. Provide a concise, high-level summary of the following code. Focus on what the code does and its key functionality. Do not include any code in your response.\n\nCode:\n```python\n{code_snippet}\n```"
    try:
        response = gemini_client.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error summarizing {file_path}: {e}")
        return f"Unable to summarize {file_path}"

def gemini_document(code_snippet, file_path):
    prompt = f"You are an expert technical writer. Generate detailed documentation for the following code in Markdown format. Include the following sections:\n- **Description**: A detailed explanation of what the code does.\n- **Signatures**: Function/Class signatures.\n- **Parameters**: List of parameters with types and descriptions.\n- **Returns**: Description of return values.\n- **Examples**: Usage examples if applicable.\n\nCode:\n```python\n{code_snippet}\n```"
    try:
        response = gemini_client.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error documenting {file_path}: {e}")
        return f"Unable to document {file_path}"

def analyze_code(code_snippet, file_path, file_size, last_commit, max_length=512):
    chunks = chunk_code(code_snippet)
    all_embeddings = []
    all_token_embeddings = []
    for chunk in chunks:
        inputs = codebert_tokenizer(chunk, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
        with torch.no_grad():
            outputs = codebert_model(**inputs)
        all_embeddings.append(outputs.last_hidden_state[:, 0, :])
        all_token_embeddings.append(outputs.last_hidden_state[0])
    all_embeddings = torch.cat(all_embeddings, dim=0)
    avg_embedding = torch.mean(all_embeddings, dim=0)
    complexity_score = torch.norm(avg_embedding).item()
    all_token_embeddings = torch.cat(all_token_embeddings, dim=0)
    avg_token_complexity = torch.mean(torch.norm(all_token_embeddings, dim=1)).item()

    vuln_count = sum(code_snippet.count(kw) for kw in ["eval(", "exec(", "os.system(", "input(", "open("])
    vuln_keyword_score = min(4, vuln_count * 2)
    vuln_baseline = codebert_tokenizer("eval(input())", return_tensors="pt", truncation=True, max_length=max_length, padding=True)
    with torch.no_grad():
        vuln_outputs = codebert_model(**vuln_baseline)
    vuln_embedding = vuln_outputs.last_hidden_state[:, 0, :]
    vuln_similarity = torch.cosine_similarity(avg_embedding, vuln_embedding).item()
    vuln_score = min(10, vuln_keyword_score + (vuln_similarity * 5))

    tokens = codebert_tokenizer.tokenize(code_snippet)
    token_count = len(tokens)
    unique_tokens = len(set(tokens))
    token_diversity = unique_tokens / token_count if token_count > 0 else 0

    lines = code_snippet.splitlines()
    num_lines = len(lines)
    num_comments = sum(1 for line in lines if line.strip().startswith("#"))
    avg_line_length = sum(len(line) for line in lines) / num_lines if num_lines > 0 else 0
    long_lines = sum(1 for line in lines if len(line) > 80)

    file_summary = gemini_summarize(code_snippet, file_path)
    file_documentation = gemini_document(code_snippet, file_path)

    comments = [line.strip() for line in lines if line.strip().startswith("#")]
    comment_sentiment = "No comments"
    if comments:
        comment_text = " ".join(comments)
        inputs = roberta_tokenizer(comment_text, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
        with torch.no_grad():
            outputs = roberta_model(**inputs)
        sentiment = "Positive" if outputs.logits.argmax().item() == 1 else "Negative"
        comment_sentiment = f"{sentiment} (Score: {outputs.logits.softmax(dim=1).max().item():.2f})"

    vuln_labels = []
    for chunk in chunks:
        inputs = distilbert_tokenizer(chunk, return_tensors="pt", truncation=True, max_length=max_length, padding=True)
        with torch.no_grad():
            outputs = distilbert_model(**inputs)
        vuln_labels.append(outputs.logits.argmax().item())
    vuln_classification = "Risky" if sum(vuln_labels) / len(vuln_labels) > 0.5 else "Safe"

    quality_score = max(0, min(10, (token_diversity * 5) + (4 - vuln_score/2.5) + (num_comments/num_lines * 5 if num_lines else 0)))

    return {
        "file_path": file_path,
        "file_size": file_size,
        "last_commit": last_commit,
        "file_summary": file_summary,
        "file_documentation": file_documentation,
        "complexity_score": complexity_score,
        "avg_token_complexity": avg_token_complexity,
        "vuln_score": vuln_score,
        "vuln_similarity": vuln_similarity,
        "vuln_keywords_detected": vuln_count,
        "vuln_classification": vuln_classification,
        "token_count": token_count,
        "unique_tokens": unique_tokens,
        "token_diversity": token_diversity,
        "lines": num_lines,
        "comments": num_comments,
        "comment_sentiment": comment_sentiment,
        "avg_line_length": avg_line_length,
        "long_lines": long_lines,
        "quality_score": quality_score
    }

def analyze_repo(repo_url, github_token=None):
    global progress
    output_dir = f"../output_{hashlib.md5(repo_url.encode()).hexdigest()}"  # Relative to backend/
    os.makedirs(output_dir, exist_ok=True)

    metadata, code_files = fetch_repo_data(repo_url, github_token)
    progress = {"status": "analyzing", "current_file": "", "total_files": len(code_files), "processed_files": 0}

    file_jsons = []
    for file_path, file_data in tqdm(code_files.items(), desc="Processing files"):
        progress["current_file"] = file_path
        progress["processed_files"] += 1
        analysis = analyze_code(file_data["content"], file_path, file_data["size"], file_data["last_commit"])
        file_hash = hashlib.md5(file_path.encode()).hexdigest()
        file_json_path = f"{output_dir}/file_{file_hash}.json"
        with open(file_json_path, "w") as f:
            json.dump(analysis, f, indent=2)
        file_jsons.append(file_json_path)

    file_summaries = "\n".join(f"{path}: {gemini_summarize(code_files[path]['content'], path)[:100]}..." for path in code_files.keys())
    prompt = f"Based on these file summaries and metadata, describe the purpose of this repository:\nMetadata: {metadata}\nFiles:\n{file_summaries}"
    try:
        response = gemini_client.generate_content(prompt)
        repo_purpose = response.text
    except Exception as e:
        print(f"Error determining repo purpose: {e}")
        repo_purpose = "Unable to determine repo purpose"

    tagline_prompt = f"Create a catchy, single-sentence tagline for this repository based on its purpose. The tagline should be short, engaging, and descriptive. Output ONLY the tagline text. Do not use quotes or markdown.\n\nPurpose:\n{repo_purpose}"
    try:
        response = gemini_client.generate_content(tagline_prompt)
        repo_tagline = response.text.strip()
    except Exception as e:
        print(f"Error generating tagline: {e}")
        repo_tagline = "Analyze, Understand, Improve."

    all_embeddings = []
    for file_path in code_files.keys():
        chunks = chunk_code(code_files[file_path]["content"])
        file_embeddings = []
        for chunk in chunks:
            inputs = codebert_tokenizer(chunk, return_tensors="pt", truncation=True, max_length=512, padding=True)
            with torch.no_grad():
                outputs = codebert_model(**inputs)
            file_embeddings.append(outputs.last_hidden_state[:, 0, :])
        if file_embeddings:
            file_avg_embedding = torch.mean(torch.cat(file_embeddings, dim=0), dim=0)
            all_embeddings.append(file_avg_embedding.unsqueeze(0))

    if all_embeddings:
        all_embeddings = torch.cat(all_embeddings, dim=0)
        avg_embedding = torch.mean(all_embeddings, dim=0)
        avg_complexity = torch.norm(avg_embedding).item()
        similarities = [torch.cosine_similarity(all_embeddings[i], all_embeddings[j], dim=0).item()
                        for i in range(len(all_embeddings)) for j in range(i + 1, len(all_embeddings))]
        repo_coherence = np.mean(similarities) if similarities else 0
    else:
        avg_complexity, repo_coherence = 0, 0

    quality_scores = []
    for file_json_path in file_jsons:
        with open(file_json_path, "r") as f:
            data = json.load(f)
            quality_scores.append(data.get("quality_score", 0))
    
    avg_quality_score = sum(quality_scores) / len(quality_scores) if quality_scores else 0

    repo_stats = {
        "metadata": metadata,
        "repo_purpose": repo_purpose,
        "repo_tagline": repo_tagline,
        "avg_complexity": avg_complexity,
        "repo_coherence": repo_coherence,
        "avg_quality_score": avg_quality_score
    }
    repo_stats_path = f"{output_dir}/repo_stats.json"
    with open(repo_stats_path, "w") as f:
        json.dump(repo_stats, f, indent=2)

    zip_path = f"{output_dir}.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file_json in file_jsons:
            zipf.write(file_json, os.path.basename(file_json))
        zipf.write(repo_stats_path, "repo_stats.json")

    progress["status"] = "complete"
    
    # Load all file analyses to return
    all_file_analysis = []
    for file_json_path in file_jsons:
        with open(file_json_path, "r") as f:
            all_file_analysis.append(json.load(f))

    return {
        "repo_stats": repo_stats,
        "file_analysis": all_file_analysis,
        "zip_path": zip_path
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    repo_url = data.get('repo_url')
    github_token = data.get('github_token')
    if not repo_url:
        return jsonify({"error": "No repo_url provided"}), 400
    try:
        result = analyze_repo(repo_url, github_token)
        return jsonify(result)
    except Exception as e:
        print(f"Error processing {repo_url}: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/progress', methods=['GET'])
def get_progress():
    return jsonify(progress)

@app.route('/download/<path:file_path>', methods=['GET'])
def download_file(file_path):
    return send_file(file_path, as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)