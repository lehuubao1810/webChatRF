import {React, useState, useContext, useEffect} from 'react'
import Message from './message'
import {db} from "../firebase"
import {doc, onSnapshot} from "firebase/firestore"
import { ChatContext } from '../context/ChatContext'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const {data} = useContext(ChatContext)
  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats", data.chatId), (doc)=>{
      doc.exists() && setMessages(doc.data().messages)
    })
    return()=>{
      unSub()
    }
  },[data.chatId])
  return (
    <div className='messages'>
      {messages.map((m)=>(
        <Message message={m} key={m.id}/>

      ))}
    </div>
  )
}

export default Messages