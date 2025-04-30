import React from "react";

function IssuesList({ issues }) {
	return (
		<>
			<div className="issues-list bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl p-4 flex flex-col gap-2">
				{issues.map((issue, index) => (
					<div key={index} className="issue-list-items-container">
						<div className="issues-list-item h-full w-full flex justify-between gap-4 p-4 border-[1px] border-[#333] rounded-lg shadow-2xl hover:bg-[#222222]  ">
							<div>
								<a
									href={`${issue.url}`}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
								>
									{issue.title}
								</a>
							</div>
							<div>
								<div className=" flex gap-4">
									<div>
										Status:{" "}
										<span
											className={`${
												issue.status === "open"
													? "text-green-500"
													: "text-red-500"
											}`}
										>
											{issue.status === "open"
												? "Open"
												: "Closed"}
										</span>{" "}
									</div>
									<div>
										Created:{" "}
										{new Date(
											issue.created_at
										).toLocaleDateString()}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default IssuesList;
