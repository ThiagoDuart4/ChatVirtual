import React, { useState } from 'react' 
import { useAuthValue } from "../../Context/AuthContext";
import style from '../Home/Home.module.css'

import SideBar from '../../component/SideB/SideB';
import Message from '../../component/Message/Message';

const Home = () => {

  const [recipientId, setRecipientId] = useState(null);


  const handleRecipientIdChange = (newRecipientId) => {
    setRecipientId(newRecipientId); // Atualiza o estado do pai
};

  const {user} = useAuthValue()


  return (
    <div className={style.home}>

      <SideBar onRecipientIdChange={handleRecipientIdChange}  />
      <Message testeId={recipientId}  />
    </div>
  )
}

export default Home
