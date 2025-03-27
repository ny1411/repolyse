import { createContext, useContext, useState } from "react";

const InputLinkContext = createContext();

export function useInputLinkContext() {
	return useContext(InputLinkContext);
}

export function InputContext({ children }) {
	const [inputValue, setInputValue] = useState("");
	return (
		<InputLinkContext.Provider value={{ inputValue, setInputValue }}>
			{children}
		</InputLinkContext.Provider>
	);
}
