import {React, useContext, useState, useLayoutEffect, useEffect} from 'react'
import Img from '../images/img.png'
import Attach from '../images/attach.png'
import {AuthContext} from "../context/AuthContext"
import { ChatContext } from '../context/ChatContext'
import { arrayUnion, updateDoc, doc, Timestamp, serverTimestamp, getDoc } from 'firebase/firestore'
import {v4 as uuid} from "uuid"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";

const Input = () => {
  const [text, setText] = useState("")
  const [textTranslated, setTextTranslated] = useState("")
  const [img, setImg] = useState(null)
  // const [loading, setLoading] = useState(false);

  const {currentUser} =useContext(AuthContext)
  const {data} = useContext(ChatContext)
  
  
  const handleKeyDown = (e) => {
    if(e.key === "Enter"){
      e.preventDefault()
      handleSend()
    }
  }

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

  const handleTranslate = async (text, country, country_re) => {
    if (text !== ""){
      let urlAPI = `https://api.mymemory.translated.net/get?q=${text}!&langpair=${country}|${country_re}`;
      await fetch(urlAPI)
          .then((response) => response.json())
          .then((data) => {
            setTextTranslated(data.responseData.translatedText)
          })
          .catch((error) => {
            console.log(error);
          });
    } else {
      setTextTranslated("")
    }   
  }

  useLayoutEffect(() => {
    handleTranslate(text, country, country_re)
  }, [text])

  const [urlImg, setUrlImg] = useState(null)
  const handleImgInput = (e) => {
    const imgInput = e.target.files[0]
    setImg(imgInput)
    // create url for img
    setUrlImg(URL.createObjectURL(imgInput))
  }

  const handleDeleteImg = () => {
    setImg(null)
    setUrlImg(null)
  }

  useEffect(() => {
    // Khi avatar thay đổi thì xóa url cũ đi để tránh memory leak
    return () => {
      urlImg && URL.revokeObjectURL(urlImg);
    }
  }, [urlImg]);

  // setText(text + "test");

  const handleSend = async()=>{
    setText("");
    setUrlImg(null);
    // setLoading(true)
    // handleTranslate(text, country, country_re);
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
                textTranslated,
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
            date: Timestamp.now(),
            textTranslated,
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
      {urlImg && 
        <div className='imgPrev'>
          <img src={urlImg} alt="imgInput" className="imgInput"/>
          <button className="btn-deleteImgPrev" onClick={handleDeleteImg}><strong>X</strong></button>
        </div>
      }
      <div className='inputComps'>
        <input id='input' type="text" placeholder='Message' autoComplete="off" 
              onKeyDown={handleKeyDown} 
              onChange={e=>setText(e.target.value)} 
              value={text}
        />
        <div className="send">
          <img src={Attach} alt="" />
          <input type="file" style={{display:"none"}} id="file" 
              onChange={handleImgInput} 
              onClick={(e)=>{
                e.target.value = null
              }}
          />
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label>
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default Input