import {React, useState, useContext} from 'react'
// import cyno from "../images/cyno.jpg"
import {db} from "../firebase"
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore'
import {AuthContext} from "../context/AuthContext"
const Search = () => {
  const [username, setUsername] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const {currentUser} = useContext(AuthContext)

  const HandleSearch = async() =>{
    const q = query(collection(db, "users"), where("displayName", "==", username));
    try{
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data())
      });
    }catch(err){
      setErr(true)
    }

  };
  const HandleKey = (e)=>{
    e.code === "Enter" && HandleSearch();
  };
  const handleSelect = async()=>{
    const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try{
      const res = await getDoc(doc(db, "chats", combinedID));
      if(!res.exists()){
        await setDoc(doc(db,"chats",combinedID),{messages: []});
        await updateDoc(doc(db, "userChats", currentUser.uid),{
          [combinedID+".userInfo"]: {
            uid:user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedID+".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, "userChats", user.uid),{
          [combinedID+".userInfo"]: {
            uid:currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedID+".date"]: serverTimestamp()
        });
      }
    }catch(err){}
    setUser(null)
    setUsername("")
  }
  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Search username' onKeyDown={HandleKey} onChange={e=>setUsername(e.target.value)} value={username} />
      </div>
      {err && <span>User not found</span>}
      {user && <div className="userChat" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default Search