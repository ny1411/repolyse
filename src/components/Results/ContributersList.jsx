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
			<div className="contributors-list h-[calc(100vh-250px)] lg:h-[calc(100vh-200px)] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-2 gap-4 overflow-y-auto no-scrollbar">
				{contributors.map((contributor, index) => {
					const percent = (contributor.contributions / maxContributions) * 100;
					return (
						<div
							key={index}
							className="contributer-list-item-container m-auto w-full max-w-[280px]"
						>
							<div
								className="issues-list-item h-full w-full flex flex-col items-center justify-between gap-4 bg-[#1d1d1d]
						p-4 border-[1px] border-[#333] rounded-lg shadow-2xl hover:bg-[#222222] hover:scale-102 transition-all duration-300 ease-in-out"
							>
								<img
									src={contributor.avatar_url}
									alt=""
									className="h-28 w-28 md:h-36 md:w-36 rounded-sm object-cover"
								/>
								<div className="flex flex-col items-center gap-2 w-full">
									<a
										href={contributor.user_url}
										className="hover:underline text-center break-all px-2"
									>
										{contributor.user}
									</a>
									<div className="flex flex-col gap-0 md:gap-2 items-center text-[#bd4432] font-['Bebas_Neue_Pro_SemiExpanded_ExtraBold']">
										<span className="text-6xl md:text-8xl leading-none">
											{contributor.contributions}
										</span>
										<span className="text-xl md:text-2xl">
											Contributions
										</span>
									</div>
									<div
										className="h-3 bg-[#101010] rounded-full border-[3px] border-[#101010] mt-2 w-full"
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
