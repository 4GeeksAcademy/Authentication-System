import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Context} from "../store/appContext";



export const Private = () => {
    
    const {store} = useContext(Context)
    const navigate = useNavigate()

    return(
        <>
            <div className="position-absolute top-50 start-50 translate-middle text-center" style={{width: "80%"}}>
                {
                    store.token ? 
                    <>
                        <div className="alert alert-success" role="alert">Pagina Privada, Acceso concedido!</div>
                    </>
                    :
                    <>
                        <div className="alert alert-danger" role="alert">Pagina Privada, Acceso denegado!</div>
                        {navigate("/login")}
                    </>
                }
			</div>
        </>
    )
}