import {React, useContext, useState} from 'react'
import Img from '../images/img.png'
import Attach from '../images/attach.png'
import {AuthContext} from "../context/AuthContext"
import { ChatContext } from '../context/ChatContext'
import { arrayUnion, updateDoc, doc, Timestamp, serverTimestamp } from 'firebase/firestore'
import {v4 as uuid} from "uuid"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const Input = () => {
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)
  const {currentUser} =useContext(AuthContext)
  const {data} = useContext(ChatContext)
  
  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async()=>{
    setText("")
    if(img){
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on( 
        (error) => {
          // setErr(true);
          // Handle unsuccessful uploads
        }, 
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateDoc(doc(db,"chats", data.chatId),{
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId:currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            })
          });
          setImg(null)
        }
      );
    }else{
      if (text !== ""){
        await updateDoc(doc(db,"chats", data.chatId),{
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId:currentUser.uid,
            date: Timestamp.now()
          })
        })
      } else {
        // if text is empty - do nothing
        return
      }
    }
    await updateDoc(doc(db,"userChats", currentUser.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })
    await updateDoc(doc(db,"userChats", data.user.uid),{
      [data.chatId + ".lastMessage"]:{
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    })
    await updateDoc(doc(db,"userChats",currentUser.uid),{
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".data"]: serverTimestamp()
    })
    await updateDoc(doc(db,"userChats",data.user.uid),{
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".data"]: serverTimestamp()
    })
  }
  return (
    <div className='input'>
      <input id='input' type="text" placeholder='Message' autoComplete="off" onKeyDown={handleKeyDown} onChange={e=>setText(e.target.value)} value={text}/>
      <div className="send">
        <img src={Attach} alt="" />
        <input type="file" style={{display:"none"}} id="file" onChange={e=>setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Input