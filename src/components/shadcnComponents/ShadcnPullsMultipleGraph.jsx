import React, { useEffect, useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useInputLinkContext } from "../InputContext";
import { useGitHubToken } from "../GithubTokenContext";

const ShadcnPullsMultipleGraph = () => {
	const token = useGitHubToken();
	const { repoURL, setRepoURL } = useInputLinkContext();
	const [chartData, setChartData] = useState([]);

	const chartConfig = {
		openPulls: {
			label: "Open PRs",
			color: "var(--color-desktop)",
		},
		closedPulls: {
			label: "Closed PRs",
			color: "var(--color-mobile)",
		},
	};

	useEffect(() => {
		const fetchPRData = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100`;

			try {
				const res = await fetch(url, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
				const data = await res.json();

				const monthlyStats = {};

				data.forEach((pr) => {
					const date = new Date(pr.created_at);
					const month = date.toLocaleString("default", {
						month: "long",
					});
					const year = date.getFullYear();
					const key = `${month} ${year}`;

					if (!monthlyStats[key]) {
						monthlyStats[key] = {
							month: key,
							openPulls: 0,
							closedPulls: 0,
						};
					}

					if (pr.state === "open") {
						monthlyStats[key].openPulls += 1;
					} else if (pr.state === "closed") {
						monthlyStats[key].closedPulls += 1;
					}
				});

				const sortedStats = Object.values(monthlyStats).sort((a, b) => {
					const dateA = new Date(a.month);
					const dateB = new Date(b.month);
					return dateA - dateB;
				});

				setChartData(sortedStats);
			} catch (error) {
				console.error("Error fetching PR data:", error);
			}
		};
		fetchPRData();
	}, []);

	return (
		<>
			<div className=" flex flex-col items-center justify-center gap-4 p-4 font-['Chalet_New_York_1960']">
				Open PRs vs Closed PRs
				<ChartContainer config={chartConfig} className="h-[200px] w-[600px] ">
						
							<LineChart
								accessibilityLayer
								data={chartData}
								margin={{
									top: 12,
									left: 12,
									right: 12,
								}}
							>
								<CartesianGrid
									vertical={false}
									strokeOpacity={0.2}
								/>
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={true}
									tick={{ fontSize: 10 }}
									tickMargin={8}
									tickFormatter={(value) => value.slice(0, 3)}
								/>
								<ChartTooltip
									cursor={false}
									content={<ChartTooltipContent hideLabel />}
								/>
								<Line
									dataKey="openPulls"
									type="monotone"
									stroke="#369a7f"
									strokeWidth={2}
									dot={{ r: 3 }}
								/>
								<Line
									dataKey="closedPulls"
									type="monotone"
									stroke="#4f46e5"
									strokeWidth={2}
									dot={{ r: 3 }}
								/>
							</LineChart>
				</ChartContainer>
			</div>
		</>
	);
};

export default ShadcnPullsMultipleGraph;
