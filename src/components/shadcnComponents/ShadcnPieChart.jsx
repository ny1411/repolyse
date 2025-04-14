"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart, Sector } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useInputLinkContext } from "../InputContext";

export default function Component() {
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

			const apiUrl = `https://api.github.com/repos/${owner}/${repo}/languages`;
			// console.log("Fetching from:", apiUrl);

			try {
				const response = await fetch(apiUrl);
				if (!response.ok) {
					throw new Error("Failed to fetch languages");
				}
				const data = await response.json();
				//console.log("Language data:", data); // e.g., {JavaScript: 12345, HTML: 2345}

				// Calculate total size
				const totalSize = Object.values(data).reduce(
					(sum, size) => sum + size,
					0
				);

				// Create new chart data based on API response
				const newChartData = Object.entries(data).map(
					([lang, size], index) => {
						// Calculate percentage (rounded to 1 decimal place)
						const languagePercentage = parseFloat(
							((size / totalSize) * 100).toFixed(1)
						);

						// Generate a color based on index or reuse color if language already exists
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

				// Update chart data
				setChartData(newChartData);

				// Update chart config with new languages
				const newConfig = {
					languagePercentage: {
						label: "",
					},
				};

				// Add each language to the config
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

	// console.log(repoURL);

	return (
		<div className="">
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square min-h-[400px]"
			>
				<PieChart>
					<ChartTooltip content={<ChartTooltipContent hideLabel />} />
					<Pie
						data={chartData}
						dataKey="languagePercentage"
						nameKey="language"
					>
						<LabelList
							dataKey="language"
							className="fill-background"
							stroke="none"
							fontSize={12}
							formatter={(value) =>
								chartConfig[value]
									? chartConfig[value].label
									: value
							}
						/>
					</Pie>
				</PieChart>
			</ChartContainer>
		</div>
	);
}
