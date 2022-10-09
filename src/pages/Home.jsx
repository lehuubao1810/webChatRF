import React from 'react'
import Sidebar from "../components/sidebar"
import Chat from "../components/chat"
import "../style.scss"
const Home = () => {
  return (
    <div className='home'>
        <div className="container">
            <Sidebar/>
            <Chat/>
        </div>
    </div>
  )
}

export default Home