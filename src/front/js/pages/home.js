import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {


	return (
		<>
			<div className="position-absolute top-50 start-50 translate-middle text-center" style={{width: "80%"}}>
				<div className="alert alert-warning" role="alert">Por favor registrese, o si ya posee una cuenta inicie sesion!</div>
			</div>
		</>
	);
};
