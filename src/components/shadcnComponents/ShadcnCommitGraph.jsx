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
		<div className="w-full h-[320px] p-4 bg-[#222] text-white dark:bg-zinc-900 rounded-2xl shadow-md">
			<h2 className="text-xl mb-4 text-white">Commits in Last Month</h2>

			<ResponsiveContainer width="100%" height="90%">
				<ChartContainer config={chartConfig}>
					<LineChart data={commitData}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey="date" tick={{ fontSize: 10 }} />
						<YAxis />
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Line
							type="monotone"
							dataKey="commits"
							stroke="#4f46e5"
							strokeWidth={2}
							dot={{ r: 3 }}
							activeDot={{ r: 6 }}
						/>
					</LineChart>
				</ChartContainer>
			</ResponsiveContainer>
		</div>
	);
};

export default GitHubCommitsChart;
