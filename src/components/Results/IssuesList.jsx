import { CircleCheck, CircleDot } from "lucide-react";
import React from "react";

function IssuesList({ issues }) {
	console.log(issues[0]);
	return (
		<>
			<div className="issues-list bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl p-4 flex flex-col gap-2">
				{issues.map((issue, index) => (
					<div key={index} className="issue-list-items-container">
						<div className="issues-list-item h-full w-full flex justify-between gap-4 p-4 border-[1px] border-[#333] rounded-lg shadow-2xl hover:bg-[#222222]  ">
							<div>
								<div className=" flex gap-4">
									<a
										title={`${
											issue.state == "open"
												? "Open Issue"
												: "Closed Issue"
										}`}
										href={`${issue.url}`}
										target="_blank"
										rel="noopener noreferrer"
										className=" flex gap-4 hover:underline"
									>
										<div>
											<span>
												{issue.state == "open" ? (
													<CircleDot color="red" />
												) : (
													<CircleCheck color="green" />
												)}
											</span>
										</div>

										{issue.title}
									</a>
								</div>
							</div>
							<div>
								<div>
									Created:{" "}
									{new Date(
										issue.created_at
									).toLocaleDateString()}
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
