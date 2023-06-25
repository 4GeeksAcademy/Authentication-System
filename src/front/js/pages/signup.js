import React, {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../store/appContext.js"



export const Signup = () => {

    const [user, setUser] = useState({})
    // const [inputVerified, setinputVerified] = useState(true)
    // const [success, setSuccess] = useState(false)
    const {actions} = useContext(Context)
    const navigate = useNavigate()

    const handleAddUser = async () =>{
        let response = await actions.addNewUser(user)
        if(response){
            navigate("/login")
        }
    }



    return (
        <>
            <div className="fondoSignup">
                <div className="container position relative">

                    <div className="card position-absolute top-50 start-50 translate-middle" style={{width: "500px", backgroundColor: "#5655a1"}}>
                        <h2 className="card-header text-light text-center">Sign Up</h2>
                        <div className="card-body">
                            <div className="input-group mb-3" >
                                <input type="email" onChange={(event) => setUser({...user, email: event.target.value})} value={user.email || ''} className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon1"/>
                            </div>
                            <div className="input-group mb-3">
                                <input type="password" onChange={(event) => setUser({...user, password: event.target.value})} value={user.password || ''} className="form-control" id="pass1" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1"/>
                            </div>
                            <button className="btn btn-success" onClick={handleAddUser} style={{width: "100%"}}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        
        </>
    )
}