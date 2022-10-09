import {React, useContext, useState, useEffect} from 'react'
// import Cam from '../images/cam.png'
// import Add from '../images/add.png'
// import More from '../images/more.png'
import Messages from './messages'
import Input from './input'
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'

import ReactDOM from "react-dom/client";
import { async } from '@firebase/util';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from "../firebase";

const Chat = () => {
  const countries = {
    "am-ET": "Amharic",
    "ar-SA": "Arabic",
    "be-BY": "Bielarus",
    "bem-ZM": "Bemba",
    "bi-VU": "Bislama",
    "bjs-BB": "Bajan",
    "bn-IN": "Bengali",
    "bo-CN": "Tibetan",
    "br-FR": "Breton",
    "bs-BA": "Bosnian",
    "ca-ES": "Catalan",
    "cop-EG": "Coptic",
    "cs-CZ": "Czech",
    "cy-GB": "Welsh",
    "da-DK": "Danish",
    "dz-BT": "Dzongkha",
    "de-DE": "German",
    "dv-MV": "Maldivian",
    "el-GR": "Greek",
    "en-GB": "English",
    "es-ES": "Spanish",
    "et-EE": "Estonian",
    "eu-ES": "Basque",
    "fa-IR": "Persian",
    "fi-FI": "Finnish",
    "fn-FNG": "Fanagalo",
    "fo-FO": "Faroese",
    "fr-FR": "French",
    "gl-ES": "Galician",
    "gu-IN": "Gujarati",
    "ha-NE": "Hausa",
    "he-IL": "Hebrew",
    "hi-IN": "Hindi",
    "hr-HR": "Croatian",
    "hu-HU": "Hungarian",
    "id-ID": "Indonesian",
    "is-IS": "Icelandic",
    "it-IT": "Italian",
    "ja-JP": "Japanese",
    "kk-KZ": "Kazakh",
    "km-KM": "Khmer",
    "kn-IN": "Kannada",
    "ko-KR": "Korean",
    "ku-TR": "Kurdish",
    "ky-KG": "Kyrgyz",
    "la-VA": "Latin",
    "lo-LA": "Lao",
    "lv-LV": "Latvian",
    "men-SL": "Mende",
    "mg-MG": "Malagasy",
    "mi-NZ": "Maori",
    "ms-MY": "Malay",
    "mt-MT": "Maltese",
    "my-MM": "Burmese",
    "ne-NP": "Nepali",
    "niu-NU": "Niuean",
    "nl-NL": "Dutch",
    "no-NO": "Norwegian",
    "ny-MW": "Nyanja",
    "ur-PK": "Pakistani",
    "pau-PW": "Palauan",
    "pa-IN": "Panjabi",
    "ps-PK": "Pashto",
    "pis-SB": "Pijin",
    "pl-PL": "Polish",
    "pt-PT": "Portuguese",
    "rn-BI": "Kirundi",
    "ro-RO": "Romanian",
    "ru-RU": "Russian",
    "sg-CF": "Sango",
    "si-LK": "Sinhala",
    "sk-SK": "Slovak",
    "sm-WS": "Samoan",
    "sn-ZW": "Shona",
    "so-SO": "Somali",
    "sq-AL": "Albanian",
    "sr-RS": "Serbian",
    "sv-SE": "Swedish",
    "sw-SZ": "Swahili",
    "ta-LK": "Tamil",
    "te-IN": "Telugu",
    "tet-TL": "Tetum",
    "tg-TJ": "Tajik",
    "th-TH": "Thai",
    "ti-TI": "Tigrinya",
    "tk-TM": "Turkmen",
    "tl-PH": "Tagalog",
    "tn-BW": "Tswana",
    "to-TO": "Tongan",
    "tr-TR": "Turkish",
    "uk-UA": "Ukrainian",
    "uz-UZ": "Uzbek",
    "vi-VN": "Vietnamese",
    "wo-SN": "Wolof",
    "xh-ZA": "Xhosa",
    "yi-YD": "Yiddish",
    "zu-ZA": "Zulu"
  }
  
  const {data} = useContext(ChatContext)
  const {currentUser} = useContext(AuthContext)
  //console.log(languageUser)
  // useEffect(() => {
  //   const languages = document.getElementById("languages")
  //   languages.addEventListener("change", (e) => {
  //     setCountry(e.target.value)
  //     console.log(country)
  //     //console.log(e.target.value)
  //     // console.log("change")
  //   })
  // }, [])
  const [country, setCountry] = useState("")
  const getData = async () => {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    setCountry(docSnap.data().country)
  }
  getData()
   const HandleChange = async(e) => {
      setCountry(e.target.value)
       //console.log(e.target.value);
       //console.log(country);
       await updateDoc(doc(db, "users",currentUser.uid), {
            "country": e.target.value
        }) 
     //console.log(country);
   }

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          {/* <img src={Cam} alt="" />
          <img src={Add} alt="" /> */}
          {/* <img src={More} alt="" /> */}

          <select name="languages" value={country} id="languages" onChange={HandleChange}>
            {
              Object.keys(countries).map((key, index) => {
                  return <option className='optCountries' key={index} value={key}>{countries[key]}</option>
              })
            }
          </select>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}
export default Chat