import React from 'react'
import { useAuthValue } from "../../Context/AuthContext";
import style from '../Home/Home.module.css'

import SideBar from '../../component/SideB/SideB';
import Message from '../../component/Message/Message';

const Home = () => {



  const {user} = useAuthValue()


  return (
    <div className={style.home}>

      <SideBar/>
      <Message/>
    </div>
  )
}

export default Home
