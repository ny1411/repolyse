import React from "react";

function Header() {
	return (
		<>
			<header
				className="header w-full h-24
                fixed top-0 font-['Jersey_15'] font-bold tracking-[3px] flex justify-between items-center
              bg-[rgba(0,0,0,0.1)] shadow-[0_10px_100px_0_rgba(0,0,0,0.37)] 
                backdrop-blur-sm"
			>
				<h1 className="text-5xl m-24">
					<a href="./index.html">GitDocX</a>
				</h1>
				<ul className="text-xl m-24 flex">
					<li className="p-8">
						<a href="./about.html"> About</a>
					</li>
					<li className="p-8">
						<a href="./credits.html">Credits</a>
					</li>
				</ul>
			</header>
		</>
	);
}

export default Header;
