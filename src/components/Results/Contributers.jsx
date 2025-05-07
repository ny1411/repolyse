import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { useInputLinkContext } from "../InputContext";
import { useGitHubToken } from "../GithubTokenContext";
import ContributersList from "./ContributersList";

function Contributers() {
	const { repoURL, setRepoUrl } = useInputLinkContext();

	const [username, setUsername] = useState("");
	const [repoName, setRepoName] = useState("");
	const [repoAvatarURL, setRepoAvatarURL] = useState();
	const [userAccountURL, setUserAccountURL] = useState("");

	const [contributorListData, setContributionsList] = useState([]);

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

	useEffect(() => {
		const fetchContributors = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const url = `https://api.github.com/repos/${owner}/${repo}/contributors`;

			try {
				const response = await fetch(url, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch contributors");
				}

				const data = await response.json();
				console.log(data);

				const contributorData = data.map((contributor) => {
					return {
						contributions: contributor.contributions,
						user: contributor.login,
						user_url: contributor.html_url,
						avatar_url: contributor.avatar_url,
					};
				});

				setContributionsList(contributorData);
				// console.log(contributorData);
			} catch (error) {
				console.error("Error fetching contributors:", error);
			}
		};
		fetchContributors();
	}, []);

	const totalContributions = contributorListData.reduce(
		(acc, contributor) => acc + contributor.contributions,
		0
	);
	// console.log(totalContributions);
	return (
		<>
			<div className="contributers flex gap-2 p-4  bg-[#0f0f0e]">
				<SideBar />
				<div className="main-content h-[calc(100% - 1 rem)] flex flex-col w-full gap-2 p-8 rounded-2xl">
					<h1 className="header text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
						Contributers
					</h1>

					<div className="header flex gap-2 justify-between items-center ">
						<div className="user-details flex items-center gap-2 p-2 hover:scale-102 transition-all duration-300 ease-in-out">
							<img
								src={repoAvatarURL || null}
								alt=""
								className="user-avatar h-12 w-12 rounded-lg  hover:scale-102 transition-all duration-300 ease-in-out"
							/>

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
						<div
							className="contributers-count h-auto w-fit p-4 flex justify-center gap-2
							 bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl 
							 hover:scale-102 transition-all duration-300 ease-in-out hover:text-neutral-400"
						>
							Total Contributions: {totalContributions}
						</div>
					</div>
					<div
						className="contributors-list h-auto w-full p-4 bg-[#1d1d1d] rounded-xl shadow-2xl border-[1px] border-[#333]
					"
					>
						<ContributersList contributors={contributorListData} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Contributers;
