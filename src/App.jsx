import "tailwindcss";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import Result from "./components/ResultPage";
import ResultPage from "./components/ResultPage";
import { InputContext } from "./components/InputContext";

function App() {
	return (
		<>
			<InputContext>
				<Routes>
					<Route path="/" element={<SearchPage />}></Route>
					<Route path="/result" element={<ResultPage />}></Route>
				</Routes>
			</InputContext>
		</>
	);
}

export default App;
