import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { Eye, GitFork, Menu, Star, X } from "lucide-react";
import { useInputLinkContext } from "../InputContext";
import { useGitHubToken } from "../GithubTokenContext";
import IssuesList from "./IssuesList";

function Issues() {
	const { repoURL, setRepoUrl } = useInputLinkContext();

	const [username, setUsername] = useState("");
	const [repoName, setRepoName] = useState("");
	const [repoAvatarURL, setRepoAvatarURL] = useState();
	const [userAccountURL, setUserAccountURL] = useState("");

	const [issuesList, setIssuesList] = useState([]);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const token = useGitHubToken();
	useEffect(() => {
		const fetchBasicData = async () => {
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
			} catch (error) {
				console.error("Error fetching repo languages:", error);
			}
		};

		fetchBasicData();
	}, []);

	const [openIssuesCount, setOpenIssuesCount] = useState(0);
	const [closedIssuesCount, setClosedIssuesCount] = useState(0);

	useEffect(() => {
		const fetchIssues = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const apiURL = `https://api.github.com/repos/${owner}/${repo}/issues?state=all`;

			try {
				const response = await fetch(apiURL, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch issues");
				}

				const data = await response.json();

				// console.log(data[0]);
				const issuesListData = data.map((issue) => {
					return {
						title: issue.title,
						state: issue.state,
						created_at: issue.created_at,
						updated_at: issue.updated_at,
						closed_at: issue.closed_at,
						url: issue.html_url,
						user: issue.user.login,
						user_avatar: issue.user.avatar_url,
						user_url: issue.user.html_url,
					};
				});

				setIssuesList(issuesListData);
				// console.log(issuesListData[1]);
				setOpenIssuesCount(
					issuesListData.filter((issue) => issue.state === "open")
						.length
				);
				setClosedIssuesCount(
					issuesListData.filter((issue) => issue.state === "closed")
						.length
				);
			} catch (error) {
				console.error("Error fetching issues:", error);
			}
		};
		fetchIssues();
	}, []);

	return (
		<>
			<div className="min-h-screen bg-[#0f0f0e] p-4 flex gap-3 relative overflow-hidden text-white">
				
				{/* Mobile Overlay */}
				{isSidebarOpen && (
					<div 
						className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				{/* Responsive Sidebar Wrapper */}
				<div 
					className={`
						fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] w-[85%] max-w-[320px] 
						transform transition-transform duration-300 ease-in-out
						lg:static lg:transform-none lg:w-auto lg:z-auto
						${isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}
					`}
				>
					<button 
						onClick={() => setIsSidebarOpen(false)} 
						className="absolute top-6 right-6 z-50 text-neutral-400 hover:text-white lg:hidden p-1 bg-neutral-800 rounded-md border border-neutral-600"
					>
						<X size={20} />
					</button>
					<SideBar />
				</div>

				{/* Main Content */}
				<div className="main-content h-[calc(100vh-2rem)] w-full flex flex-col gap-4 lg:gap-6 lg:p-4 rounded-2xl overflow-y-auto no-scrollbar">
					
					{/* Mobile Menu Toggle */}
					<div className="lg:hidden flex items-center mb-2">
						<button 
							onClick={() => setIsSidebarOpen(true)} 
							className="text-[#e0c38e] p-2 bg-[#1d1d1d] border border-[#383838] rounded-lg shadow-md hover:scale-105 transition-transform"
						>
							<Menu size={24} />
						</button>
					</div>

					<h1 className="text-4xl md:text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
						Issues
					</h1>

					{/* Header Info Row */}
					<div className="header flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
						
						{/* User Details */}
						<div className="user-details flex items-center gap-3 p-2 bg-[#1d1d1d] lg:bg-transparent rounded-lg w-full lg:w-auto hover:scale-102 transition-all duration-300 ease-in-out">
							<img
								src={repoAvatarURL || null}
								alt=""
								className="user-avatar h-10 w-10 md:h-12 md:w-12 rounded-lg object-cover"
							/>
							<div className="text-sm md:text-base break-all">
								<a href={userAccountURL} className="hover:underline font-bold">
									{username}
								</a>
								<span className="mx-1">/</span>
								<a href={repoURL} className="hover:underline">
									{repoName}
								</a>
							</div>
						</div>

						{/* Issues Count Badges */}
						<div className="issues-count flex flex-row gap-2 w-full lg:w-auto whitespace-nowrap text-sm md:text-base font-bold">
							<div className="repo-open-issue-count h-auto w-full lg:w-fit p-3 md:p-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out hover:text-green-400">
								<p>Open Issues:</p>
								<span>{openIssuesCount}</span>
							</div>
							<div className="repo-open-issue-count h-auto w-full lg:w-fit p-3 md:p-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl hover:scale-102 transition-all duration-300 ease-in-out hover:text-red-400">
								<p>Closed Issues:</p>
								<span>{closedIssuesCount}</span>
							</div>
						</div>
					</div>

					{/* List Container */}
					<div className="issues-list-container flex-grow h-auto w-full p-2 md:p-4 bg-[#1d1d1d] rounded-xl shadow-2xl border border-[#333] overflow-y-auto no-scrollbar">
						<IssuesList issues={issuesList} />
					</div>
					
				</div>
			</div>
		</>
	);
}

export default Issues;
