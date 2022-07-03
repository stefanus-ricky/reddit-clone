import React from 'react'
import { useNavigate } from "react-router-dom";

export default function Homepage() {
    let navigate = useNavigate();

    function handleDemo(){
        navigate("/demo/r/programming/top?t=week")
    }
    // TODO: show different menu if user loged in
    return (
        <div style={{display:"flex", flexDirection:'column', justifyContent:"center", height:"100vh", alignItems:"center"}}>
            <div className='flex btn-lg btn-primary m-3' onClick={handleDemo}>Show Demo</div>
            {/* <button type="button" className='flex btn-lg btn-secondary m-3' title="Not available yet" disabled onClick={()=>null}
            >
                Sign in
            </button>
            <button type="button" className='flex btn-lg btn-secondary m-3' title="Not available yet" disabled onClick={()=>null}
            >
                Link your reddit account
            </button> */}
            {/* <div className='flex btn-lg btn-primary m-3 hide' onClick={()=>null}>Sign in</div>
            <div className='flex btn-lg btn-primary hide' onClick={()=>navigate("/permission-url")}>Link your reddit account</div> */}

        </div>
    )
}
