"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
const chartData = [
	{
		language: "chrome",
		languagePercentage: 90.9,
		fill: "var(--color-chrome)",
	},
	{
		language: "safari",
		languagePercentage: 7.7,
		fill: "var(--color-safari)",
	},
	{
		language: "firefox",
		languagePercentage: 1.4,
		fill: "var(--color-firefox)",
	},
];

const chartConfig = {
	languagePercentage: {
		label: "Language %: ",
	},
	chrome: {
		label: "Chrome",
		color: "var(--chart-1)",
	},
	safari: {
		label: "Safari",
		color: "var(--chart-2)",
	},
	firefox: {
		label: "Firefox",
		color: "var(--chart-3)",
	},
};

export default function Component() {
	return (
		<div className="">
			<ChartContainer
				config={chartConfig}
				className="mx-auto aspect-square min-h-[400px]"
			>
				<PieChart>
					<ChartTooltip
						content={
							<ChartTooltipContent
								nameKey="languagePercentage"
								hideLabel
							/>
						}
					/>
					<Pie data={chartData} dataKey="languagePercentage">
						<LabelList
							dataKey="language"
							className="fill-foreground"
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
