import React from "react";

function ContributersList({ contributors }) {
	const totalContributions = contributors.reduce(
		(acc, contributor) => acc + contributor.contributions,
		0
	);
	const maxContributions = Math.max(
		...contributors.map((c) => c.contributions)
	);
	return (
		<>
			<div className="contributors-list h-154 w-full grid grid-cols-4 p-2 gap-4 overflow-scroll no-scrollbar">
				{contributors.map((contributor, index) => {
					const percent =
						(contributor.contributions / maxContributions) * 100;
					return (
						<div
							key={index}
							className="contributer-list-item-container m-auto"
						>
							<div
								className="issues-list-item h-full w-56 flex flex-col items-center justify-between gap-4 bg-[#1d1d1d]
                        p-4 border-[1px] border-[#333] rounded-lg shadow-2xl hover:bg-[#222222] hover:scale-102 transition-all duration-300 ease-in-out"
							>
								<img
									src={contributor.avatar_url}
									alt=""
									className="h-36 w-36 rounded-sm"
								/>
								<div className="flex flex-col items-center gap-2 w-full">
									<a
										href={contributor.user_url}
										className="hover:underline"
									>
										{contributor.user}
									</a>
									<div className="flex flex-col gap-2 items-center text-[#bd4432] font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold']">
										<span className="text-8xl">
											{contributor.contributions}
										</span>
										<span className="text-2xl">
											Contributions
										</span>
									</div>
									<div
										className="h-3 bg-[#101010] rounded-full border-[3px] border-[#101010]"
										style={{ width: "calc(100% - 1rem)" }}
									>
										<div
											className="contributions-progress-bar h-full rounded-full bg-green-500"
											style={{ width: `${percent}%` }}
										></div>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}

export default ContributersList;
