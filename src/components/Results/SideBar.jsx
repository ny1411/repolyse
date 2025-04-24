import {
	ChartLine,
	CircleDot,
	File,
	Folder,
	GitCommitVertical,
	LayoutDashboard,
	Lightbulb,
	Users,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

function SideBar() {
	const navigate = useNavigate();
	return (
		<>
			<div
				className="sidebar h-[calc(100vh-2rem)] w-[30%] p-8 
            bg-[#222222] rounded-2xl font-['Chalet_New_York_1960'] 
            overflow-y-scroll no-scrollbar"
			>
				<div className="header flex items-center justify-center scale-110 text-[#bd4432] my-1 mb-8">
					<svg
						width="188"
						height="48"
						viewBox="0 0 188 48"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.49337 48V42.9474V3.78947L0 0.605163H13.7687C15.7074 0.605163 17.4038 1.20312 18.8578 2.39904C20.3119 3.59496 21.4428 5.31679 22.2506 7.56454C23.0584 9.81229 23.4624 12.5067 23.4624 15.6478C23.4624 18.8177 23.0457 21.4905 22.2124 23.6662C21.3876 25.8419 20.2269 27.4845 18.7303 28.594C17.2422 29.7034 15.5033 30.2582 13.5136 30.2582H6.779V20.9214H12.085C12.9183 20.9214 13.6284 20.7484 14.2151 20.4026C14.8103 20.0424 15.2652 19.4733 15.5799 18.6952C15.903 17.9171 16.0645 16.9013 16.0645 15.6478C16.0645 14.3798 15.903 13.3496 15.5799 12.5571C15.2652 11.7503 14.8103 11.1595 14.2151 10.7849C13.6284 10.3958 12.9183 10.2013 12.085 10.2013H9.58507V44.8685L2.49337 48ZM17.7992 24.5523L25.5031 46.7368L17.4536 45.4737L10.2483 24.5523H17.7992Z"
							fill="#BD4432"
						/>
						<path
							d="M26.4853 44.8685V2.39904L24.9337 0.631579L45.3114 0.605163L42.8859 10.2878H33.577V17.8955H44.3421V27.5781H33.577V35.1859H45.2604V44.8685H26.4853Z"
							fill="#BD4432"
						/>
						<path
							d="M48.8286 44.8685V0.605163H60.1039C62.0426 0.605163 63.739 1.25355 65.1931 2.55033C66.6471 3.84711 67.778 5.6698 68.5858 8.01841C69.3937 10.367 69.7976 13.1119 69.7976 16.253C69.7976 19.4229 69.3809 22.1677 68.5476 24.4875C67.7228 26.8073 66.5621 28.594 65.0655 29.8475C63.5774 31.1011 61.8385 31.7278 59.8488 31.7278H53.1142V22.391H58.4202C59.2535 22.391 59.9636 22.1461 60.5503 21.6562C61.1455 21.1519 61.6004 20.4387 61.9151 19.5165C62.2382 18.5944 62.3997 17.5065 62.3997 16.253C62.3997 14.985 62.2382 13.9043 61.9151 13.011C61.6004 12.1033 61.1455 11.4116 60.5503 10.9362C59.9636 10.4463 59.2535 10.2013 58.4202 10.2013H55.9203V44.8685H48.8286Z"
							fill="#BD4432"
						/>
						<path
							d="M97.7052 22.7368C97.7052 27.6646 97.1397 31.8215 96.0088 35.2075C94.8779 38.5791 93.3515 41.1367 91.4298 42.8801C89.5081 44.6092 87.3652 45.4737 85.0013 45.4737C82.6204 45.4737 80.4691 44.602 78.5474 42.8585C76.6342 41.1007 75.1121 38.5359 73.9812 35.1643C72.8587 31.7783 72.2975 27.6358 72.2975 22.7368C72.2975 17.8091 72.8587 13.6594 73.9812 10.2878C75.1121 6.90174 76.6342 4.34421 78.5474 2.61517C80.4691 0.871723 82.6204 0 85.0013 0C87.3652 0 89.5081 0.871723 91.4298 2.61517C93.3515 4.34421 94.8779 6.90174 96.0088 10.2878C97.1397 13.6594 97.7052 17.8091 97.7052 22.7368ZM90.4094 22.7368C90.4094 20.0857 90.2011 17.8523 89.7844 16.0368C89.3763 14.2069 88.7683 12.8237 87.9605 11.8871C87.1612 10.9362 86.1748 10.4607 85.0013 10.4607C83.8279 10.4607 82.8373 10.9362 82.0295 11.8871C81.2302 12.8237 80.6222 14.2069 80.2055 16.0368C79.7974 17.8523 79.5933 20.0857 79.5933 22.7368C79.5933 25.388 79.7974 27.6286 80.2055 29.4585C80.6222 31.274 81.2302 32.6572 82.0295 33.6082C82.8373 34.5447 83.8279 35.013 85.0013 35.013C86.1748 35.013 87.1612 34.5447 87.9605 33.6082C88.7683 32.6572 89.3763 31.274 89.7844 29.4585C90.2011 27.6286 90.4094 25.388 90.4094 22.7368Z"
							fill="#BD4432"
						/>
						<path
							d="M100.986 44.8685V0.605163H108.078V35.1859H118.639V44.8685H100.986Z"
							fill="#BD4432"
						/>
						<path
							d="M114.695 0.605163H123.607L128.709 17.0959H128.913L134.015 0.605163H142.621L141.284 2.52632L132.331 29.4585V44.8685H125.291V29.4585L116.338 2.52632L114.695 0.605163Z"
							fill="#BD4432"
						/>
						<path
							d="M144.337 44.8685V38.2117L156.684 10.2878H144.388V0.605163H165.714V7.26196L153.367 35.1859H165.663V44.8685H144.337Z"
							fill="#BD4432"
						/>
						<path
							d="M169.174 44.8685V2.52632L167.554 0.605163H188L185.507 10.2878H176.266V17.8955H187.031V27.5781H176.266V35.1859H187.949V44.8685H169.174Z"
							fill="#BD4432"
						/>
					</svg>
				</div>
				<div className="sidebar-main text-xl">
					<div
						className="dashboard-btn flex items-center gap-2 p-2 cursor-pointer
                         bg-gradient-to-r from-[rgba(255,92,67,0.03)] via-[rgba(255,92,67,0.3)] via-25%  to-[rgba(255,92,67,0)] "
						onClick={() => navigate("/dashboard")}
					>
						<LayoutDashboard color="#ff5c43" />
						DASHBOARD
					</div>
					<div
						className="insights-btn my-2 flex items-center gap-2 p-2 cursor-pointer"
						onClick={() => navigate("/insights")}
					>
						<ChartLine />
						INSIGHTS
					</div>
					<div
						className="Issues-btn my-2 flex items-center gap-2 p-2 cursor-pointer"
						onClick={() => navigate("/issues")}
					>
						<CircleDot />
						ISSUES
					</div>
					<div
						className="contributers-btn my-2 flex items-center gap-2 p-2 cursor-pointer"
						onClick={() => navigate("/contributers")}
					>
						{" "}
						<Users />
						CONTRIBUTERS
					</div>
					<div
						className="file-structure-btn my-2 p-2"
						onClick={() => navigate("/documentation")}
					>
						<div className="flex items-center gap-2 ">
							<h1 className="flex  cursor-pointer">
								<GitCommitVertical />
								FILE STRUCTURE
							</h1>
						</div>
						<div className="file-structure font-['Inter'] text-[0.8rem]">
							<ul className="file-structure-elements ml-8 ">
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<Folder />
									</div>
									node modules
								</li>
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<Folder />
									</div>
									public
								</li>
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<Folder />
									</div>
									src
								</li>
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<File />
									</div>
									index.html
								</li>
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<File />
									</div>
									README.md
								</li>
								<li className="file-structure-element w-fit flex items-center gap-2 my-2 cursor-pointer">
									<div className="logo scale-90">
										<File />
									</div>
									package.json
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default SideBar;
