import { CircleCheck, CircleDot } from "lucide-react";
import React from "react";

function IssuesList({ issues }) {
	// console.log(issues[0]);
	return (
		<>
			<div className="issues-list bg-[#1d1d1d] border-[1px] border-[#383838] rounded-xl p-4 flex flex-col gap-2">
				{issues.map((issue, index) => (
					<div key={index} className="issue-list-items-container">
						<div
							className="
						issues-list-item h-full w-full 
						flex justify-between gap-4 p-4 
						border-[1px] border-[#333] rounded-lg 
						shadow-2xl hover:bg-[#222222] hover:scale-101 transition-all duration-300 ease-in-out "
						>
							<div className="flex flex-col gap-2 w-full">
								<div className="flex gap-4 items-center">
									<div>
										<span>
											{issue.state == "open" ? (
												<span title="Open Issue">
													<CircleDot color="red" />
												</span>
											) : (
												<span title="Closed Issue">
													<CircleCheck color="green" />
												</span>
											)}
										</span>
									</div>

									<div>
										<div className=" flex gap-4">
											<a
												href={`${issue.url}`}
												target="_blank"
												rel="noopener noreferrer"
												className=" flex gap-4 hover:underline"
											>
												{issue.title}
											</a>
										</div>
										<div className="text-[#9198a1] text-sm flex gap-2">
											<a
												href={`${issue.user_url}`}
												className=" hover:underline"
											>
												{issue.user}
											</a>
											Created:{" "}
											{new Date(
												issue.created_at
											).toLocaleDateString()}
										</div>
									</div>
								</div>
							</div>
							<div>
								<div></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default IssuesList;
