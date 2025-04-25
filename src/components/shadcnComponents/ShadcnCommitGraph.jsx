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
import { useGitHubToken } from "../GithubTokenContext";

const GitHubCommitsChart = () => {
	const token = useGitHubToken();

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
				const response = await fetch(url, {
					headers: {
						Authorization: `token ${token}`,
					},
				});
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
		<div className=" flex flex-col items-center justify-center gap-4 p-4 font-['Chalet_New_York_1960']">
			Commits in Last Month
			<ChartContainer
				config={chartConfig}
				className="h-[225px] w-[600px]"
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
						stroke="#4f46e5"
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
