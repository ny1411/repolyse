import React from "react";
import { useInputLinkContext } from "./InputContext";
import { Navigate, useNavigate } from "react-router-dom";
import ResultPage from "./ResultPage";

function SubmitBtn() {
	const { inputValue, setInputValue } = useInputLinkContext();
	const navigate = useNavigate();

	if (inputValue.trim() == "") {
		return (
			<>
				<a title="Enter the repo link">
					<button
						className="submit-btn w-48 h-18 bg-[#1198d2] 
                    flex justify-center items-center rounded-full 
                    cursor-not-allowed font-['Jersey_10'] text-[2rem]
                    hover:bg-[#b60909] hover:shadow-red-600"
						title="Enter the repo link"
						style={{
							boxShadow:
								"rgba(0, 105, 150, 1) 0px 0px 50px, rgba(0, 105, 150, 1) 0px 0px 150px",
						}}
					>
						SUBMIT
					</button>
				</a>
			</>
		);
	}

	return (
		<>
			<button
				className="submit-btn w-48 h-18 bg-[#1198d2] 
                flex justify-center items-center rounded-full 
                cursor-pointer font-['Jersey_10'] text-[2rem]
                hover:bg-[#0982b6] active:bg-[#006a98]"
				style={{
					boxShadow:
						"rgba(0, 105, 150, 1) 0px 0px 50px, rgba(0, 105, 150, 1) 0px 0px 150px",
				}}
				onClick={() => navigate("/result")}
			>
				SUBMIT
			</button>
		</>
	);
}

export default SubmitBtn;
