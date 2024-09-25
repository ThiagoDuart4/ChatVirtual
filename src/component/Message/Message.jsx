import React from "react";
import style from "../Message/Message.module.css";

import { useAuthValue } from "../../Context/AuthContext";
import { collection, query, orderBy, limit, serverTimestamp,addDoc } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { db } from "../../Firebase";

import { useState } from "react";
const Message = () => {

    const {user} = useAuthValue()

    const messageRef= collection(db,"messages");
    const QueryMessages = query(messageRef,orderBy('createdAt'), limit(25))
    const [messages] = useCollectionData(QueryMessages,{idField: "id"})

  

    const [formValue,setFormValue] = useState()

    const HandleMessage =  async(e) =>{
        e.preventDefault() 
        const {photoURL,uid} = user
        
        await addDoc(messageRef,{
            text:formValue,
            uid,
            photoURL,
            createdAt: serverTimestamp()
        })

        setFormValue('')
    }
 

  return (
    <>
      <div className={style.message}>
      {messages && messages.map((msg) => (
        <div key={msg.uid}>
          <p>{msg.text}</p>
          {msg.photoURL && <img src={msg.photoURL} alt={`${msg.userName}'s profile`} />}
        </div>
      ))}
      </div>
      <div className={style.formMessage}>
        <form onSubmit={HandleMessage} >
            <input type="text" value = {formValue} onChange={e => setFormValue (e.target.value)} />
            <button type="submit" > Enviar</button>
        </form>
      </div>
    </>
  );
};

export default Message;
