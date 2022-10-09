import {React, useContext, useEffect, useRef} from 'react'
import { ChatContext } from '../context/ChatContext'
// import cyno from "../images/cyno.jpg"
import {AuthContext} from "../context/AuthContext"


const Message = ({message}) => {
  const {currentUser} =useContext(AuthContext)
  const {data} = useContext(ChatContext)
  const ref = useRef()
  useEffect(()=>{
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])
  
  // Handle zoom in/out on image
  const handleZoomImg = (e) => {
    e.target.classList.toggle("imgMess--zoom")
  }


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        {/* <span>just now</span> */}
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text }</p>}
        {/* {message.img && <img src={message.img} alt="" className='imgMess'  />} */}
        {message.img && <img src={message.img} alt="" className='imgMess' onClick={handleZoomImg} />}
      </div> 
    </div>
  )
}

export default Message