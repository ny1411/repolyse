import "tailwindcss";
import { Routes, Route } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import Dashboard from "./components/Results/Dashboard";
import { InputContext } from "./components/InputContext";
import Documentation from "./components/Results/Documentation";
import Contributers from "./components/Results/Contributers";
import Issues from "./components/Results/Issues";
import Insights from "./components/Results/Insights";

function App() {
	return (
		<>
			<InputContext>
				<Routes>
					<Route path="/" element={<SearchPage />}></Route>
					<Route path="/dashboard" element={<Dashboard />}></Route>
					<Route path="/insights" element={<Insights />}></Route>
					<Route path="/issues" element={<Issues />}></Route>
					<Route
						path="/contributers"
						element={<Contributers />}
					></Route>
					<Route
						path="/documentation"
						element={<Documentation />}
					></Route>
				</Routes>
			</InputContext>
		</>
	);
}

export default App;
