import React from "react";

function SubmitBtn() {
	return (
		<>
			<button
				className="submit-btn w-48 h-18 bg-[#1198d2] flex justify-center items-center rounded-full cursor-pointer font-['Jersey_10'] text-[2rem]"
				style={{
					boxShadow:
						"rgba(0, 105, 150, 1) 0px 0px 50px, rgba(0, 105, 150, 1) 0px 0px 150px",
				}}
			>
				SUBMIT
			</button>
		</>
	);
}

export default SubmitBtn;
