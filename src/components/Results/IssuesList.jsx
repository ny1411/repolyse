import React, { useEffect, useState } from "react";
import { useInputLinkContext } from "../InputContext";
import { useGitHubToken } from "../GithubTokenContext";

function IssuesList() {
	const { repoURL, serRepoURL } = useInputLinkContext();

	const [openIssuesCount, setOpenIssuesCount] = useState(0);
	const [closedIssuesCount, setClosedIssuesCount] = useState(0);

	const token = useGitHubToken();

	useEffect(() => {
		const fetchIssues = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const apiURL = `https://api.github.com/repos/${owner}/${repo}/issues`;

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

				const issuesList = data.map((issue) => {
					return {
						title: issue.title,
						state: issue.state,
						created_at: issue.created_at,
						updated_at: issue.updated_at,
						closed_at: issue.closed_at,
						url: issue.html_url,
					};
				});
				console.log(issuesList);
				setOpenIssuesCount(
					issues.filter((issue) => issue.state === "open").length
				);
				setClosedIssuesCount(
					issues.filter((issue) => issue.state === "closed").length
				);
			} catch (error) {
				console.error("Error fetching issues:", error);
			}
		};
		fetchIssues();
	}, []);
	return (
		<>
			<div className="issues-list flex gap-2">
				<div className="repo-open-issue-count h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
					<p>Open Issues:</p>
					{openIssuesCount}
				</div>
				<div className="repo-open-issue-count h-auto w-full p-4 flex justify-center gap-2 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl">
					<p>Closed Issues:</p>
					{closedIssuesCount}
				</div>
			</div>
		</>
	);
}

export default IssuesList;
