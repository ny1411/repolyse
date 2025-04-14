import { createContext, useContext, useState } from "react";

const InputLinkContext = createContext();

export function useInputLinkContext() {
	return useContext(InputLinkContext);
}

export function InputContext({ children }) {
	const [repoURL, setRepoUrl] = useState("");
	// console.log(repoURL);
	return (
		<InputLinkContext.Provider value={{ repoURL, setRepoUrl }}>
			{children}
		</InputLinkContext.Provider>
	);
}
