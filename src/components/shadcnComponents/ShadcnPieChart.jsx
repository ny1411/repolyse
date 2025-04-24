import { Pie, PieChart } from "recharts";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useInputLinkContext } from "../InputContext";
import { useGitHubToken } from "../GithubTokenContext";

export default function Component() {
	const token = useGitHubToken();

	const { repoURL, setRepoURL } = useInputLinkContext();

	const [chartData, setChartData] = useState([
		{
			language: "javascript",
			languagePercentage: 90.9,
			fill: "hsl(359, 2%, 90%)",
		},
		{
			language: "css",
			languagePercentage: 7.7,
			fill: "hsl(240, 1%, 74%)",
		},
		{
			language: "html",
			languagePercentage: 1.4,
			fill: "hsl(240, 1%, 58%)",
		},
	]);

	const [chartConfig, setChartConfig] = useState({
		languagePercentage: {
			label: "Language% ",
		},
		javascript: {
			label: "Javascript",
		},
		css: {
			label: "CSS",
		},
		html: {
			label: "HTML",
		},
	});

	useEffect(() => {
		const fetchLanguages = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const languageApiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;

			try {
				const response = await fetch(languageApiUrl, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
				if (!response.ok) {
					throw new Error("Failed to fetch languages");
				}
				const data = await response.json();
				const totalSize = Object.values(data).reduce(
					(sum, size) => sum + size,
					0
				);

				const newChartData = Object.entries(data).map(
					([lang, size], index) => {
						const languagePercentage = parseFloat(
							((size / totalSize) * 100).toFixed(1)
						);

						const existingEntry = chartData.find(
							(item) =>
								item.language.toLowerCase() ===
								lang.toLowerCase()
						);

						const colorHues = [
							90, 200, 300, 30, 270, 150, 0, 180, 330, 60,
						];
						const fill =
							existingEntry?.fill ||
							`hsl(${
								colorHues[index % colorHues.length]
							}, 70%, 80%)`;

						return {
							language: lang.toLowerCase(),
							languagePercentage,
							fill,
						};
					}
				);

				setChartData(newChartData);

				const newConfig = {
					languagePercentage: {
						label: "",
					},
				};

				newChartData.forEach((item) => {
					newConfig[item.language] = {
						label:
							item.language.charAt(0).toUpperCase() +
							item.language.slice(1),
					};
				});

				setChartConfig(newConfig);
			} catch (error) {
				console.error("Error fetching repo languages:", error);
			}
		};

		fetchLanguages();
	}, []);

	return (
		<div className="">
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square min-h-[350px] w-auto"
			>
				<PieChart>
					<ChartTooltip content={<ChartTooltipContent hideLabel />} />
					<Pie
						data={chartData}
						dataKey="languagePercentage"
						nameKey="language"
					></Pie>
				</PieChart>
			</ChartContainer>
		</div>
	);
}
