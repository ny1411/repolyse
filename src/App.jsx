import "tailwindcss";
import BackgroundThreeScene from "./components/BackgroundThreeScene";
import RepoLinkInput from "./components/RepoLinkInput";
import SubmitBtn from "./components/SubmitBtn";
import Header from "./components/Header";

function App() {
	return (
		<>
			<BackgroundThreeScene />
			<Header />
			<div className="container h-max absolute top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center">
				<RepoLinkInput />
				<SubmitBtn />
			</div>
		</>
	);
}

export default App;
