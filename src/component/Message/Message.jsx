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

 console.log(testeId)
   // Referência da coleção de mensagens
    const messageRef= collection(db,"messages");
 

      const QueryMessages = userLogado  && testeId ? query(
        messageRef,
        where("recipientId", "==", userLogado), 
          where("recipientId", "==",testeId ),
        orderBy("createdAt", "desc")
      ) : null;
    
    
      // Filtra as mensagens onde o usuário é o remetente (autor)
      const userQueryMessages = query(
        messageRef,
        where('uid', "==", userLogado),
      );
    
      // Hook para buscar as mensagens onde o usuário é o destinatário
      const [messages] = useCollectionData(QueryMessages, { idField: "id" });

      // Hook para buscar as mensagens onde o usuário é o remetente
      const [userMessages] = useCollectionData(userQueryMessages, { idField: "id" });
      console.log(userMessages)

  // Combina as mensagens e remove duplicatas
  const combinedMessages = [...(messages || []), ...(userMessages || [])];




  // Ordena o array combinado pela data de criação (createdAt)
  const sortedMessages = combinedMessages.sort((a, b) => {
    return a.createdAt?.seconds - b.createdAt?.seconds; // Ordena em ordem crescente
  });
   // Estado para armazenar valor do input e o destinatário
   const [formValue, setFormValue] = useState('');
   const [users, setUsers] = useState([]); // Armazena lista de usuários
   const [selectedRecipientId, setSelectedRecipientId] = useState(''); // Armazena o destinatário selecionado

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

    const HandleMessage =  async(e) =>{
        e.preventDefault() 
        const {photoURL,uid} = user
      
        if (!selectedRecipientId) {
          alert("Selecione um destinatário antes de enviar a mensagem");
          return;
      }

        await addDoc(messageRef,{
            text:formValue,
            uid,
            recipientId: selectedRecipientId, // Inclui o recipientId
            photoURL,
            createdAt: serverTimestamp()

           
        })

        setFormValue('')
    }
 

  return (
    <>
  <div>
      {sortedMessages.map((msg) => (
        <div key={msg.id}>
          <p>{msg.text}</p>
          {msg.photoURL && <img src={msg.photoURL} alt="Profile" />}
        </div>
      ))}
    </div>

    <div className={style.formMessage}>
        {/* Selecionar destinatário */}
        <select onChange={(e) => setSelectedRecipientId(e.target.value)}>
            <option value="">Selecione o destinatário</option>
            {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
            ))}
        </select>

        <form onSubmit={HandleMessage}>
            <input
                type="text"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
            />
            <button type="submit">Enviar</button>
        </form>
    </div>
</>
  );
};

export default Message;
