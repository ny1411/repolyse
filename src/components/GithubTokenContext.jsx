import { createContext, useContext } from "react";

const GitHubTokenContext = createContext();

export const GitHubTokenProvider = ({ children }) => {
	const token = import.meta.env.VITE_GITHUB_TOKEN;

	return (
		<GitHubTokenContext.Provider value={token}>
			{children}
		</GitHubTokenContext.Provider>
	);
};

// Custom hook for easy access
export const useGitHubToken = () => {
	return useContext(GitHubTokenContext);
};
