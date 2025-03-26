import React from "react";

function RepoLinkInput() {
	return (
		<>
			<form
				action="PUT"
				className="repo-link-form flex justify-center text-center items-center h-[70px] w-[800px] rounded-full bg-black m-20"
				style={{
					boxShadow:
						"rgba(215, 215, 215, 0.3) 0px 0px 50px, rgb(215, 215, 215, 0.5) 0px 0px 150px",
				}}
			>
				<a href="http://github.com/">
					<svg
						className="github-icon h-[50px] w-[50px] m-2.5 "
						width="37"
						height="37"
						viewBox="0 0 37 36"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g clip-path="url(#clip0_16_10)">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M18.4449 0C8.24534 0 0 8.25 0 18.4564C0 26.6149 5.28307 33.5209 12.6121 35.9651C13.5284 36.1489 13.864 35.568 13.864 35.0794C13.864 34.6515 13.8338 33.1849 13.8338 31.6567C8.70293 32.757 7.63446 29.4566 7.63446 29.4566C6.80989 27.3176 5.58813 26.7679 5.58813 26.7679C3.90879 25.6372 5.71046 25.6372 5.71046 25.6372C7.5733 25.7595 8.55078 27.5317 8.55078 27.5317C10.1995 30.3428 12.8564 29.5485 13.9252 29.0595C14.0777 27.8677 14.5667 27.0427 15.0858 26.5845C10.9935 26.1566 6.68794 24.5678 6.68794 17.4784C6.68794 15.4616 7.42039 13.8116 8.58098 12.5284C8.39787 12.0701 7.75641 10.1753 8.76447 7.63912C8.76447 7.63912 10.3219 7.15013 13.8335 9.53362C15.3369 9.12962 16.8874 8.9241 18.4449 8.92237C20.0023 8.92237 21.5899 9.1365 23.0559 9.53362C26.5679 7.15013 28.1253 7.63912 28.1253 7.63912C29.1333 10.1753 28.4915 12.0701 28.3084 12.5284C29.4996 13.8116 30.2018 15.4616 30.2018 17.4784C30.2018 24.5678 25.8962 26.1259 21.7734 26.5845C22.4454 27.165 23.0253 28.2649 23.0253 30.0067C23.0253 32.4818 22.9951 34.4681 22.9951 35.079C22.9951 35.568 23.3311 36.1489 24.2471 35.9655C31.5761 33.5205 36.8592 26.6149 36.8592 18.4564C36.8894 8.25 28.6138 0 18.4449 0Z"
								fill="white"
							/>
						</g>
						<defs>
							<clipPath id="clip0_16_10">
								<rect width="37" height="36" fill="white" />
							</clipPath>
						</defs>
					</svg>
				</a>

				<input
					className="w-5xl outline-none border-none w-full text-center font-['Jersey_10'] text-[2rem] font-light p-2.5"
					type="text"
					name="repo-link-input"
					placeholder="paste repo link"
					id="#repoLinkInput"
				/>
				<button
					className="paste-btn border-none outline-none rounded-r-full h-full flex items-center justify-center cursor-pointer"
					style={{
						backgroundColor: "white",
						width: "125px",
						height: "inherit",
					}}
				>
					<svg
						width="35"
						height="35"
						viewBox="0 0 35 35"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M28.1027 17.888L30.7688 15.2375H30.7378C32.1648 13.7588 32.9467 11.7742 32.9119 9.71952C32.877 7.66484 32.0282 5.70797 30.5518 4.27856C29.1055 2.8838 27.1746 2.10443 25.1653 2.10443C23.1561 2.10443 21.2252 2.8838 19.7789 4.27856L17.1128 6.92915"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M6.91368 17.113L4.26308 19.7636C2.83605 21.2423 2.05413 23.2268 2.08901 25.2815C2.12388 27.3362 2.9727 29.2931 4.44909 30.7225C5.89537 32.1172 7.82629 32.8966 9.83553 32.8966C11.8448 32.8966 13.7757 32.1172 15.222 30.7225L17.8726 28.0719"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M11.3003 2V6.65017"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M2 11.3002H6.65017"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M23.7002 28.3509V33.0011"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M28.3496 23.7008H32.9998"
							stroke="black"
							stroke-width="3"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</form>
		</>
	);
}

export default RepoLinkInput;
