import React from "react";
import { useNavigate } from "react-router-dom";
import RepoLinkInput from "./RepoLinkInput";
import { useInputLinkContext } from "./InputContext";
import SubmitBtn from "./SubmitBtn";
import BackgroundThreeScene from "./BackgroundThreeScene";
import Header from "./Header";

function SearchPage() {
	const { repoURL } = useInputLinkContext();
	const navigate = useNavigate();

	function HandleSubmit() {
		if (repoURL) {
			navigate("/dashboard");
		}
	}

	return (
		<>
			<div className="relative w-full min-h-screen overflow-hidden">
				<BackgroundThreeScene />
				<Header />
				<div
					className="absolute top-[50%] left-[50%] 
				transform translate-x-[-50%] translate-y-[-50%] 
				flex flex-col justify-center items-center w-full px-4 sm:px-0 sm:w-auto"
				>
					<RepoLinkInput />
					<SubmitBtn onClick={HandleSubmit} />
				</div>
			</div>
		</>
	);
}

export default SearchPage;
