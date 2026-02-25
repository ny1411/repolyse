import React, { useEffect, useState } from "react";
import SideBar from "./SideBar.jsx";
import ShadcnPieChart from "../shadcnComponents/ShadcnPieChart.jsx";
import ShadcnCommitGraph from "../shadcnComponents/ShadcnCommitGraph.jsx";
import { useInputLinkContext } from "../InputContext.jsx";
import { Eye, GitFork, Star, Loader2, Menu, X, LayoutDashboard, CircleDot, Users, GitCommitVertical, File, Folder } from "lucide-react";
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

	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		const fetchLanguages = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const apiURL = `https://api.github.com/repos/${owner}/${repo}`;

			try {
				const headers = {};
				if (token) {
					headers.Authorization = `token ${token}`;
				}
				const response = await fetch(apiURL, {
					headers,
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
				const response = await fetch("http://127.0.0.1:5000/analyze", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ repo_url: repoURL, github_token: token }),
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
		<div className="min-h-screen bg-[#0f0f0e] p-4 flex gap-3 relative overflow-hidden">
            
            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/*RESPONSIVE SIDEBAR WRAPPER*/}
            <div 
                className={`
                    fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] w-[85%] max-w-[320px] 
                    transform transition-transform duration-300 ease-in-out
                    lg:static lg:transform-none lg:w-auto lg:z-auto
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
                `}
            >
                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="absolute top-6 right-6 z-50 text-neutral-400 hover:text-white lg:hidden p-1 bg-neutral-800 rounded-md border border-neutral-600"
                >
                    <X size={20} />
                </button>
                <SideBar />
            </div>

      {/* MAIN CONTENT */}
      <main className="main-content w-full h-[calc(100vh-2rem)] flex flex-col gap-2 rounded-2xl overflow-y-auto no-scrollbar pb-4">
        
        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center mb-2">
            <button onClick={() => setIsSidebarOpen(true)} className="text-[#e0c38e] p-2 bg-[#1d1d1d] rounded-lg">
                <Menu />
            </button>
        </div>

        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
            <h1 className="text-4xl md:text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
                Dashboard
            </h1>
            <h1 className="font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-xl md:text-2xl text-white">
                Repo Overview
            </h1>
        </div>
        <div className="header flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-[#0f0f0e] sticky top-0 z-10 py-2">
            <div className="user-details flex items-center gap-2 p-2 bg-[#1d1d1d] lg:bg-transparent rounded-lg w-full lg:w-auto">
                <div className="flex items-center gap-3">
                   <div className="h-12 w-12 bg-neutral-700 rounded-lg flex-shrink-0 overflow-hidden">
                       <a href={userAccountURL}>
							<img src={repoAvatarURL|| null} alt="avatar" className="h-full w-full object-cover"/>
                		</a>   
					</div>
                   <div className="text-white text-sm md:text-base break-all">
                    	<a href={userAccountURL}	className="hover:underline font-bold "> 
							<span className="font-bold">{username}</span> 
						</a> / <a href={repoURL} className="hover:underline">
							<span>{repoName}</span>
						</a>
                   </div>
                </div>
            </div>

            <div className="repo-details-container grid grid-cols-3 gap-2 w-full lg:w-auto text-white text-xs md:text-base font-bold">
                <div className="repo-stars p-2 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#1d1d1d] border border-[#383838] rounded-xl">
                    <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" />
                    <span className="hidden md:inline">Stars:</span>
                    <span>{starredCount}</span>
                </div>
                <div className="repo-watchers p-2 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#1d1d1d] border border-[#383838] rounded-xl">
                    <Eye className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />
                    <span className="hidden md:inline">Watchers:</span>
                    <span>{watchersCount}</span>
                </div>
                <div className="repo-forks p-2 md:p-4 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#1d1d1d] border border-[#383838] rounded-xl">
                    <GitFork className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                    <span className="hidden md:inline">Forks:</span>
                    <span>{forkedCount}</span>
                </div>
            </div>
        </div>

        <div className="repo-analysis-overview flex flex-col gap-4 text-white">
            
            <div className="repo-overview-top flex flex-col xl:flex-row gap-4">
                <div className="repo-top-language flex-1 p-4 bg-[#1d1d1d] border border-[#383838] rounded-xl min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-neutral-500"><ShadcnPieChart /></div>
                </div>
                <div className="repo-commit-graph flex-1 p-4 bg-[#1d1d1d] border border-[#383838] rounded-xl min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-neutral-500"><ShadcnCommitGraph /></div>
                </div>
            </div>

            <div className="open-vs-closed-pr-graph w-full flex flex-col xl:flex-row gap-4 font-['Chalet_New_York_1960'] text-lg md:text-2xl rounded-xl">
                
                <div className="flex-1 p-4 bg-[#1d1d1d] border border-[#383838] rounded-xl shadow-2xl min-h-[300px] flex items-center justify-center">
                    <div className="text-center text-neutral-500"><ShadcnPullsMultipleGraph /></div>
                </div>

                <div className="basic-documentation w-full xl:w-[470px] flex-shrink-0 p-4 bg-[#1d1d1d] border border-[#383838] rounded-xl">
                    <h1 className="flex justify-center items-center shadow-2xl mb-4 text-[#e0c38e] font-bold">
                        Documentation
                    </h1>
                    {analysisData && (
                    <div className="ai-analysis p-2 md:p-4 text-sm md:text-lg">
                        <h2 className="text-xl md:text-2xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] mb-4 text-[#e0c38e]">
                            AI Analysis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-['Chalet_New_York_1960']">
                            <div className="col-span-1 md:col-span-2">
                                <p className="font-bold text-neutral-400">Tagline:</p>
                                <p>{analysisData.repo_stats.repo_tagline}</p>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <p className="font-bold text-neutral-400">Purpose:</p>
                                <p className="line-clamp-3">{analysisData.repo_stats.repo_purpose}</p>
                            </div>
                            <div>
                                <p className="font-bold text-neutral-400">Complexity:</p>
                                <p>{analysisData.repo_stats.avg_complexity.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="font-bold text-neutral-400">Quality:</p>
                                <p>{analysisData.repo_stats.avg_quality_score.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
					)}
                </div>
            </div>
        </div>
      </main> 
    </div>
		</>
	);
}

export default Dashboard;
