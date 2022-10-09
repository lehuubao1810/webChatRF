import {React, useState, useContext, useEffect} from 'react'
import Message from './message'
import {db} from "../firebase"
import { ChatContext } from '../context/ChatContext'

import { AuthContext } from '../context/AuthContext'
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const Messages = () => {
  const [messages, setMessages] = useState([])
  const {data} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)

  // Get country from firestore
  const [country, setCountry] = useState("")
  const getData = async (user, setCountry) => {
    const docRef = doc(db, "users", user);
    const docSnap = await getDoc(docRef);
    setCountry(docSnap.data().country)
  }
  getData(currentUser.uid, setCountry);

  const userID = currentUser.uid;
  const chatID = data.chatId;
  let userID_re = chatID.replace(userID, "");
  const [country_re, setCountry_re] = useState("")
  getData(userID_re, setCountry_re);

  useEffect(() => {
    // translate messages
    messages.map((message) => {
      let text = message.text;
      let urlAPI = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${country_re}|${country}`;
      fetch(urlAPI)
      .then((response) => response.json())
      .then((data) => {
        console.log(`${country_re}|${country}`)
        console.log(data.responseData.translatedText);
      })
    })
  }, [messages])
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