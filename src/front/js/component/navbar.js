import React, {useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext"

export const Navbar = () => {

	const navigate = useNavigate()
	const {store, actions} = useContext(Context)

	const handleLogOut = async () => {
		actions.logout()
	   
		navigate("/")
			   
   }

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Welcome</span>
				</Link>
				<div className="ml-auto d-flex justify-content-between" style={{width: "150px"}}>
					{ !store.token ?
					<>
						<Link to="/login">
							<button className="btn btn-success me-2" style={{width: "100px", height: "100%"}}>Log in</button>

						</Link>
						<Link to="/signup">
							<button className="btn btn-success" style={{width: "100px", height: "100%"}}>Sign Up</button>
						</Link>
					</>
					:
					<>
						<button onClick={handleLogOut} className="btn btn-danger" style={{minWidth: "70%"}}>Log out</button>
					</>
					}
					
					
				</div>
			</div>
		</nav>
	);
};
