import React, { useEffect, useState } from "react";
import SideBar from "./SideBar.jsx";
import ShadcnPieChart from "../shadcnComponents/ShadcnPieChart.jsx";
import ShadcnCommitGraph from "../shadcnComponents/ShadcnCommitGraph.jsx";
import { useInputLinkContext } from "../InputContext.jsx";
import { Eye, GitFork, Star } from "lucide-react";
import ShadcnPullsMultipleGraph from "../shadcnComponents/ShadcnPullsMultipleGraph.jsx";
import { useGitHubToken } from "../GithubTokenContext.jsx";

function Dashboard() {
	const { repoURL, setRepoUrl } = useInputLinkContext();
	const [starredCount, setStarredCount] = useState(0);
	const [forkedCount, setForkedCount] = useState(0);
	const [watchersCount, setWatchersCount] = useState(0);
	const [openIssuesCount, setOpenIssuesCount] = useState(0);
	const [closedIssuesCount, setClosedIssuesCount] = useState(0);

	const [username, setUsername] = useState("");
	const [repoName, setRepoName] = useState("");
	const [repoAvatarURL, setRepoAvatarURL] = useState("");
	const [userAccountURL, setUserAccountURL] = useState("");

	const token = useGitHubToken();
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

		fetchLanguages();
	}, []);

	return (
		<>
			<div className="dashboard p-4 flex gap-3 bg-[#0f0f0e]">
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
						<div className="user-details flex items-center gap-2 p-2">
							<img
								src={repoAvatarURL}
								alt=""
								srcset=""
								className="user-avatar h-12 w-12 rounded-lg"
							/>

							<div>
								<a
									href={userAccountURL}
									className="hover:underline font-bold"
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
							<div className="repo-stars h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<Star />
								<p>Stars:</p>
								{starredCount}
							</div>
							<div className="repo-watchers h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<Eye />
								<p>Watchers:</p>
								{watchersCount}
							</div>
							<div className="repo-forks h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<GitFork />
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
							font-['Chalet_New_York_1960']"
							>
								<ShadcnPieChart />
							</div>
							<div
								className="repo-top-language h-fit w-fit
							p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl text-2xl
							font-['Chalet_New_York_1960']"
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
							<div className="p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<ShadcnPullsMultipleGraph />
							</div>
							<div className="basic-documentation h-full w-[470px] p-4 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<h1 className="flex justify-center items-center">
									Documentation
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
