import React, { useEffect, useState } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Line,
	LineChart,
	CartesianGrid,
	LabelList,
} from "recharts";
import { useInputLinkContext } from "../InputContext";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const GitHubCommitsChart = () => {
	const { repoURL, setRepoUrl } = useInputLinkContext();

	const [commitData, setCommitData] = useState([]);

	const chartConfig = {
		desktop: {
			label: "Desktop",
			color: "hsl(var(--chart-1))",
		},
	};

	useEffect(() => {
		const fetchCommits = async () => {
			const urlParts = repoURL
				.replace("https://github.com/", "")
				.split("/");
			const owner = urlParts[0];
			const repo = urlParts[1];

			const oneMonthAgo = new Date();
			oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
			const sinceDate = oneMonthAgo.toISOString();

			const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${sinceDate}&per_page=100`;

			try {
				const response = await fetch(url);
				const data = await response.json();

				const dailyCount = {};

				data.forEach((commit) => {
					const date = new Date(commit.commit.author.date)
						.toISOString()
						.split("T")[0];
					dailyCount[date] = (dailyCount[date] || 0) + 1;
				});

				const formatted = Object.entries(dailyCount).map(
					([date, count]) => ({
						date,
						commits: count,
					})
				);

				formatted.sort((a, b) => a.date.localeCompare(b.date));
				setCommitData(formatted);
			} catch (error) {
				console.error("Error fetching commits:", error);
			}
		};

		fetchCommits();
	}, []);

	return (
		<div className="w-full h-[290px] p-4 flex flex-col justify-center items-center bg-[#222] text-white dark:bg-zinc-900 rounded-2xl shadow-md">
			<h2 className="text-xl mb-4 text-white">Commits in Last Month</h2>

			<ChartContainer
				config={chartConfig}
				className="w-auto h-[85%] overflow-hidden"
			>
				<LineChart
					accessibilityLayer
					data={commitData}
					margin={{
						top: 12,
						left: 12,
						right: 12,
					}}
				>
					<CartesianGrid vertical={false} strokeOpacity={0.2} />
					<XAxis dataKey="date" tick={{ fontSize: 10 }} />
					<ChartTooltip
						cursor={false}
						content={<ChartTooltipContent hideLabel />}
					/>
					<Line
						type="monotone"
						dataKey="commits"
						stroke="#ffffff"
						strokeWidth={2}
						dot={{ r: 3 }}
						activeDot={{ r: 6 }}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
};

export default GitHubCommitsChart;
