import React from "react";
import RepoLinkInput from "./RepoLinkInput";
import SubmitBtn from "./SubmitBtn";
import BackgroundThreeScene from "./BackgroundThreeScene";
import Header from "./Header";

function SearchPage() {
	function HandleSubmit() {}

	return (
		<>
			<BackgroundThreeScene />
			<Header />
			<div
				className="container h-max absolute top-[50%] left-[50%] 
			transform translate-x-[-50%] translate-y-[-50%] 
			flex flex-col justify-center items-center"
			>
				<RepoLinkInput />
				<SubmitBtn onClick={HandleSubmit} />
			</div>
		</>
	);
}

export default SearchPage;
