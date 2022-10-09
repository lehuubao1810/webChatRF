// type rafce
import React from 'react'
import Add from "../images/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db, auth, storage } from "../firebase";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import {useNavigate, Link} from "react-router-dom"
const Register = () => {
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const handleSubmit = async (e)=>{
        setLoading(true)
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const avt = e.target[3].files[0];
        try{
            const res = await createUserWithEmailAndPassword(auth, email, password)
            const storageRef = ref(storage, displayName);

            await uploadBytesResumable(storageRef, avt).then(() => {
                try {
                    getDownloadURL(storageRef).then(async(url) => {
                        await updateProfile(res.user, {
                            displayName,
                            photoURL: url
                        })
                        await setDoc(doc(db, "users", res.user.uid), {
                            uid: res.user.uid,
                                displayName,
                                email,
                                photoURL: url,
                                country: "vi-VN"
                        }) 
                        await setDoc(doc(db,"userChats", res.user.uid),{})
                        navigate("/")
    
                    })
                } catch (error) {
                    console.log(error)
                    setErr(true);
                    setLoading(false);
                }
            });
            
        }catch(err){
            setErr(true);
            setLoading(false);
        }
        
    }    


  return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">PDBB Chat O.O</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
                <div className='inputBox'>
                    <input type="text" required="required"/>
                    <span>username</span>
                </div>
                <div className='inputBox'>
                    <input type="email" required="required"/>
                    <span>email</span>
                </div>
                <div className='inputBox'>
                    <input type="password" required="required"/>
                    <span>password</span>
                </div>
                <div className="fileSubmit">
                    <input style={{display: "none"}} type="file" id='file' className='file'/>
                    <label htmlFor="file">
                        <img src={Add} alt="" />
                        <span>Add an avatar</span>
                        {loading && 
                            <div class="follow-the-leader">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        }
                    </label>
                </div>
                <button disabled={loading}>Sign up</button>
                


                {err && <span>Something went wrong</span>}
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    </div>
  )
}

export default Register