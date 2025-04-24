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
			<div className="dashboard p-4 flex gap-3 ">
				<SideBar />
				<div className="main-content h-[calc(100% - 1 rem)] w-full p-4 rounded-2xl">
					<div className="header flex justify-baseline items-baseline gap-4">
						<h1 className="header text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
							Dashboard
						</h1>
						<h1 className="font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-2xl">
							Repo Overview
						</h1>
					</div>
					<div className="repo-analysis-overview h-fit w-fit">
						<div className="h-fit flex gap-2 my-2 font-['Chalet_New_York_1960'] font-medium">
							<div
								className="repo-top-language h-fit w-fit
								flex items-center justify-center flex-col
								p-4 bg-[#222222] rounded-xl text-2xl"
							>
								Top Language
								<ShadcnPieChart />
							</div>
							<div className="h-fit flex flex-col gap-2 m-auto ml-0">
								<div className="flex gap-2">
									<div className="repo-issues h-auto w-full p-4 flex justify-center gap-2 bg-[#222222] rounded-xl">
										<Star />
										<p>Stars:</p>
										{starredCount}
									</div>
									<div className="repo-issues h-auto w-full p-4 flex justify-center gap-2 bg-[#222222] rounded-xl">
										<Eye />
										<p>Watchers:</p>
										{watchersCount}
									</div>
									<div className="repo-issues h-auto w-full p-4 flex justify-center gap-2 bg-[#222222] rounded-xl">
										<GitFork />
										<p>Forks:</p>
										{forkedCount}
									</div>
								</div>
								<div>
									<ShadcnCommitGraph />
								</div>
							</div>
						</div>
						<div
							className="
							open-vs-closed-pr-graph 
							max-h-[400px] w-full p-4 gap-4 
							flex flex-col items-center 
							font-['Chalet_New_York_1960'] font-medium text-2xl
							bg-[#222222] rounded-xl"
						>
							Open vs Closed PRs
							<ShadcnPullsMultipleGraph />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
