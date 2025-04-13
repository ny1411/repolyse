import React, { useState } from "react";
import SideBar from "./SideBar.jsx";
import ShadcnPieChart from "../shadcnComponents/ShadcnPieChart.jsx";
import { useInputLinkContext } from "../InputContext.jsx";
import { Cell, Pie, PieChart } from "recharts";

function Dashboard() {
	// const { repoURL, setRepoURL } = useInputLinkContext();

	// const data = [
	// 	{ name: "JavaScript", value: 90.9, color: "#8884d8" },
	// 	{ name: "CSS", value: 7.7, color: "#82ca9d" },
	// 	{ name: "HTML", value: 1.4, color: "#ffc658" },
	// ];

	// const maxValue = Math.max(...data.map((item) => item.value));
	// const [activeIndex, setActiveIndex] = useState(0);

	return (
		<>
			<div className="dashboard m-4 flex gap-3">
				<SideBar />
				<div className="main-content h-[calc(100% - 2 rem)] w-full p-8  rounded-2xl">
					<h1 className="header text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
						Dashboard
					</h1>
					<div className="repo-analysis-overview mt-4  ">
						<h1 className="font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-2xl">
							Repo Analysis Overview
						</h1>
						<div className="flex gap-2 my-2 font-['Chalet_New_York_1960'] font-medium">
							<div className="repo-health h-[10rem] w-fit p-4 bg-[#222222] rounded-xl">
								<h1>Repo Health</h1>
								<div className="repo-health-quality">Good</div>
							</div>
							<div
								className="repo-top-language h-fit w-fit 
								flex items-center justify-center flex-col 
								p-4 bg-[#222222] rounded-xl"
							>
								Top Language
								<ShadcnPieChart />
								{/* <PieChart width={400} height={400}>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={60}
										outerRadius={80}
										dataKey="value"
										onMouseEnter={(_, index) =>
											setActiveIndex(index)
										}
										label={({ name, percent }) =>
											`${name} (${(percent * 100).toFixed(
												0
											)}%)`
										}
										fontSize={13}
									>
										{data.map((entry, index) => (
											<Cell
												key={index}
												fill={entry.color}
												opacity={
													activeIndex === index
														? 1
														: 0.6
												}
											/>
										))}
									</Pie>
								</PieChart> */}
							</div>
							<div className="repo-issues h-[10rem] w-fit p-4 bg-[#222222] rounded-xl">
								Issues
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
