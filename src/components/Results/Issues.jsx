import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { Eye, GitFork, Star } from "lucide-react";
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

				const issuesListData = data.map((issue) => {
					return {
						title: issue.title,
						state: issue.state,
						created_at: issue.created_at,
						updated_at: issue.updated_at,
						closed_at: issue.closed_at,
						url: issue.html_url,
					};
				});

				setIssuesList(issuesListData);
				// console.log(issuesListData[1].state);
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
			<div className="issues flex gap-3 p-4 bg-[#0f0f0e]">
				<SideBar />
				<div className="main-content h-[calc(100% - 1 rem)] w-full flex flex-col gap-2 p-4 rounded-2xl">
					<h1 className="header text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
						Issues
					</h1>
					<div className="header flex justify-between items-center">
						<div className="user-details flex items-center gap-2 p-2">
							<img
								src={repoAvatarURL || null}
								alt=""
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
						<div className="issues-list flex gap-2 whitespace-nowrap">
							<div className="repo-open-issue-count h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<p>Open Issues:</p>
								{openIssuesCount}
							</div>
							<div className="repo-open-issue-count h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
								<p>Closed Issues:</p>
								{closedIssuesCount}
							</div>
						</div>
					</div>
					<div className="issues-list-container">
						<IssuesList issues={issuesList} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Issues;
