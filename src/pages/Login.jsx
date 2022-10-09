// type rafce
import React from 'react'
import { useState } from "react";
import {useNavigate, Link} from "react-router-dom"
import { getAuth,signInWithEmailAndPassword } from "firebase/auth";
const Login = () => {
    const [err, setErr] = useState(false);
    const navigate = useNavigate()
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;
        try{
          const auth = getAuth()
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        }catch(err){
            setErr(true);
        }
        
    }
  return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">PDBB Chat O.O</span>
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
              <div className='inputBox'>
                  <input type="email" required="required"/>
                  <span>email</span>
              </div>
              <div className='inputBox'>
                  <input type="password" required="required"/>
                  <span>password</span>
              </div>
              <button>Sign in</button>
              {err && <span>Something went wrong</span>}
            </form>
            <p>Not have an account yet? <Link to="/register">Register</Link></p>
        </div>
    </div>
  )
}

export default Login