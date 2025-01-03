import React, { useState, useEffect } from "react";
import style from "../Message/Message.module.css";

import { useAuthValue } from "../../Context/AuthContext";
import { collection, query, orderBy, limit, serverTimestamp, addDoc, getDocs, where } from "firebase/firestore";

import { getDatabase, ref, get } from "firebase/database";

import { useCollectionData } from 'react-firebase-hooks/firestore';

import { db } from "../../Firebase";


const Message = ({testeId}) => {

 

  // usuario conectado
    const {user} = useAuthValue()
    const userLogado = user.uid

// Função para verificar o status do usuário

const [userStatus, setUserStatus] = useState();

const checkUserStatus = async () =>{
  const db = getDatabase();
  const userStatusRef = ref(db, `/onlineStatus/${userLogado}`);
  const snapshot = await get(userStatusRef);
  if (snapshot.exists()) {
    const isOnline = snapshot.val();

    if (isOnline) {
      setUserStatus('online')
    } else {
      setUserStatus('offline')
    }
    // console.log(`O usuário ${userLogado} está ${isOnline ? 'online' : 'offline'}.`);
  } else {
    console.log('Usuário não encontrado.');
  }
 }
 checkUserStatus()

 // Função para verificar o status do usuário
 const [receptorStatus, setReceptorStatus] = useState();

const checkReceptorStatus = async () =>{
  const db = getDatabase();
  const userStatusRef = ref(db, `/onlineStatus/${testeId}`);
  const snapshot = await get(userStatusRef);
  if (snapshot.exists()) {
    const isOnline = snapshot.val();
    if (isOnline) {
      setReceptorStatus('online')
    } else {
      setReceptorStatus('offline')
    }
  } else {
    console.log('Usuário não encontrado.');
  }
 }
 checkReceptorStatus()

   // Referência da coleção de mensagens
    const messageRef= collection(db,"messages");

  // Filtrando mensagens entre o usuário logado e o destinatário selecionado
  const messagesQuery = testeId && userLogado ?  query(
    messageRef,
    where("recipientId", "in", [userLogado, testeId]),
    where("uid", "in", [userLogado, testeId]),
    orderBy("createdAt", "desc") 
  ):null ;

  // Usando o hook para pegar as mensagens
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });


   // Estado para armazenar valor do input e o destinatário
   const [formValue, setFormValue] = useState('');
   const [users, setUsers] = useState([]); // Armazena lista de usuários

  
    // Função para buscar usuários do Firebase
    useEffect(() => {
      const fetchUsers = async () => {
          const usersCollection = collection(db, 'users');
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(usersList);
      };

      fetchUsers();
  }, []);

  // Enviando mensagem para destinatario
    const HandleMessage =  async(e) =>{
        e.preventDefault() 
        const {photoURL,uid} = user
      
        if (!testeId) {
          alert("Selecione um destinatário antes de enviar a mensagem");
          return;
      }

        await addDoc(messageRef,{
            text:formValue,
            uid,
            recipientId: testeId, // Inclui o recipientId
            photoURL,
            createdAt: serverTimestamp()

           
        })

        setFormValue('')
    }
 
     const ReceptorUser =  users.find(u => u.id === testeId)

     
  return (
    <>
    {testeId && userLogado ? (<div className={style.DestinatarioUser}> 
        <img src={ReceptorUser.photoURL} alt="" />
        <div className={style.DestinatarioUserName}>
          <h4>{ReceptorUser.name}</h4>
          <p>{receptorStatus}</p>
        </div>
       </div>):(
            <div className={style.NotFoudDestinatario}>
              <h1>Destinatário não encontrado!</h1>
             <span>Selecione um destinatario</span>
            </div>
          )}
    {testeId && userLogado ? (
      <div>
        <div className={style.messageContainer}>
          {/* Renderizando as mensagens */}
          {messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className={style.message}>
                <strong>{msg.uid === userLogado ? "Você" : users.find(u => u.id === msg.uid)?.name}:</strong>
                <p>{msg.text}</p>
                {msg.photoURL && <img src={msg.photoURL} alt="Profile" />}
              </div>
            ))
          ) : (
              <p>....</p>
          )}
        </div>

        <div className={style.formMessage}>
          <form onSubmit={HandleMessage}>
            <input
              type="text"
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="Digite sua mensagem..."
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    ) : null}
  </>
  );
};

export default Message;

