import React, { useEffect, useState } from "react";
import SideBar from "./SideBar.jsx";
import ShadcnPieChart from "../shadcnComponents/ShadcnPieChart.jsx";
import ShadcnCommitGraph from "../shadcnComponents/ShadcnCommitGraph.jsx";
import { useInputLinkContext } from "../InputContext.jsx";
import { Eye, GitFork, Star, Loader2 } from "lucide-react";
import ShadcnPullsMultipleGraph from "../shadcnComponents/ShadcnPullsMultipleGraph.jsx";
import { useGitHubToken } from "../GithubTokenContext.jsx";

function Dashboard() {
	const { repoURL } = useInputLinkContext();
	const [starredCount, setStarredCount] = useState(0);
	const [forkedCount, setForkedCount] = useState(0);
	const [watchersCount, setWatchersCount] = useState(0);

	const [username, setUsername] = useState("");
	const [repoName, setRepoName] = useState("");
	const [repoAvatarURL, setRepoAvatarURL] = useState();
	const [userAccountURL, setUserAccountURL] = useState("");

	const token = useGitHubToken();
	const [analysisData, setAnalysisData] = useState(null);
	const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
	const [analysisError, setAnalysisError] = useState(null);

	useEffect(() => {
		const fetchLanguages = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const apiURL = `https://api.github.com/repos/${owner}/${repo}`;

			try {
				const response = await fetch(apiURL, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch languages");
				}
				const data = await response.json();
				setUsername(data.owner.login);
				setRepoName(data.name);
				setRepoAvatarURL(data.owner.avatar_url);
				setUserAccountURL(data.owner.html_url);
				setStarredCount(data.stargazers_count);
				setForkedCount(data.forks_count);
				setWatchersCount(data.subscribers_count);
			} catch (error) {
				console.error("Error fetching repo languages:", error);
			}
		};

		const fetchAnalysis = async () => {
			if (!repoURL) return;
			setIsAnalysisLoading(true);
			try {
				const response = await fetch("http://localhost:5000/analyze", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ repo_url: repoURL }),
				});
				if (!response.ok) throw new Error("Analysis failed");
				const data = await response.json();
				setAnalysisData(data);
			} catch (err) {
				setAnalysisError(err.message);
				console.error("Error fetching analysis:", err);
			} finally {
				setIsAnalysisLoading(false);
			}
		};

		fetchLanguages();
		fetchAnalysis();
	}, [repoURL, token]);

	if (isAnalysisLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center bg-[#0f0f0e] text-[#e0c38e]">
				<Loader2 className="h-16 w-16 animate-spin" />
				<span className="ml-4 text-2xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold']">
					Analyzing Repository...
				</span>
			</div>
		);
	}

	return (
		<>
			<div className="dashboard p-4 flex gap-3 bg-[#0f0f0e] ">
				<SideBar />
				<div className="main-content h-[calc(100% - 1 rem)] w-full flex flex-col gap-2 p-4 rounded-2xl">
					<div className=" flex justify-baseline items-baseline gap-4">
						<h1 className=" text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
							Dashboard
						</h1>
						<h1 className="font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-2xl">
							Repo Overview
						</h1>
					</div>
					<div className="header flex justify-between items-center">
						<div className="user-details flex items-center gap-2 p-2 hover:scale-102 transition-all duration-300 ease-in-out">
							<a href={userAccountURL}>
								<img
									src={repoAvatarURL || null}
									alt=""
									className="user-avatar h-12 w-12 rounded-lg hover:scale-102 transition-all duration-300 ease-in-out"
								/>
							</a>

							<div>
								<a
									href={userAccountURL}
									className="hover:underline font-bold "
								>
									{username}
								</a>
								/
								<a href={repoURL} className="hover:underline">
									{repoName}
								</a>
							</div>
						</div>
						<div className="repo-details-container flex gap-2">
							<div className="repo-stars h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] shadow-2xl  border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out">
								<Star className="hover:text-amber-300" />
								<p>Stars:</p>
								{starredCount}
							</div>
							<div className="repo-watchers h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] shadow-2xl  border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out">
								<Eye className="hover:text-neutral-500" />
								<p>Watchers:</p>
								{watchersCount}
							</div>
							<div className="repo-forks h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] shadow-2xl  border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out">
								<GitFork className="hover:text-purple-400" />
								<p>Forks:</p>
								{forkedCount}
							</div>
						</div>
					</div>
					<div className="repo-analysis-overview h-full w-full flex flex-col gap-4">
						<div className="repo-overview-top flex justify-center gap-4">
							<div
								className="repo-top-language h-fit w-fit
							p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl text-2xl
							font-['Chalet_New_York_1960'] shadow-2xl hover:scale-102 transition-all duration-300 ease-in-out"
							>
								<ShadcnPieChart />
							</div>
							<div
								className="repo-top-language h-fit w-fit
							p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl text-2xl
							font-['Chalet_New_York_1960'] shadow-2xl hover:scale-102 transition-all duration-300 ease-in-out"
							>
								<ShadcnCommitGraph />
							</div>
						</div>
						<div
							className="
							open-vs-closed-pr-graph 
							w-fit
							flex items-center gap-4
							font-['Chalet_New_York_1960'] text-2xl
							rounded-xl"
						>
							<div className="p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl shadow-2xl hover:scale-102 transition-all duration-300 ease-in-out">
								<ShadcnPullsMultipleGraph />
							</div>
							<div className="basic-documentation h-full w-[470px] p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out">
								<h1 className="flex justify-center items-center shadow-2xl  ">
									Documentation
								</h1>
								{analysisData && (
									<div className="ai-analysis p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl shadow-2xl hover:scale-102 transition-all duration-300 ease-in-out">
										<h2 className="text-2xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] mb-4 text-[#e0c38e]">
											AI Analysis
										</h2>
										<div className="grid grid-cols-2 gap-4 font-['Chalet_New_York_1960'] text-lg">
											<div className="col-span-2">
												<p className="font-bold text-neutral-400">Tagline:</p>
												<p>{analysisData.repo_stats.repo_tagline}</p>
											</div>
											<div className="col-span-2">
												<p className="font-bold text-neutral-400">Purpose:</p>
												<p>{analysisData.repo_stats.repo_purpose}</p>
											</div>
											<div>
												<p className="font-bold text-neutral-400">
													Complexity Score:
												</p>
												<p>
													{analysisData.repo_stats.avg_complexity.toFixed(2)}
												</p>
											</div>
											<div>
												<p className="font-bold text-neutral-400">
													Quality Score:
												</p>
												<p>
													{analysisData.repo_stats.avg_quality_score.toFixed(2)}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
