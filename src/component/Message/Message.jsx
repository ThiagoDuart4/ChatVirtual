import React, { useState, useEffect } from "react";
import style from "../Message/Message.module.css";

import { useAuthValue } from "../../Context/AuthContext";
import { collection, query, orderBy, limit, serverTimestamp, addDoc, getDocs, where } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { db } from "../../Firebase";


const Message = ({testeId}) => {

  // usuario conectado
    const {user} = useAuthValue()
    const userLogado = user.uid


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
 

  return (
    <>
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
            <p>Nenhuma mensagem encontrada.</p>
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

