import React from "react";
import SideBar from "./SideBar";

function Documentation() {
	return (
		<>
			<div className="documentation flex gap-3 m-4">
				<SideBar />
				<div className="main-content h-[calc(100% - 2 rem)] w-full p-8 bg-[#222222] rounded-2xl">
					<h1 className="header text-6xl font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold'] text-[#e0c38e]">
						Documentation
					</h1>
					<div className="repo-analysis-overview">
						<div className="repo-language"></div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Documentation;
