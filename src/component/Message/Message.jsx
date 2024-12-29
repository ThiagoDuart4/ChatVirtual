// Message é onde fica localizado todas as minhas mensagens e de quem me enviou as mensagens

// Importaçoes
import React, { useState, useEffect } from "react";
import style from "../Message/Message.module.css";
// context que pega o meu usuario autentificado
import { useAuthValue } from "../../Context/AuthContext";
//  metodos para pegar as informaçoes do meu banco de dados
import { collection, query, orderBy, limit, serverTimestamp, addDoc, getDocs, where } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
//   banco de dados
import { db } from "../../Firebase";

// incio da minah função onde esta recebendo testeId como parametro de uma determinada area do meu codigo, que nada mais é que o proprio uid do destinatario da mensagen, ou seja,para quem esta enviando a mensagem
const Message = ({testeId}) => {

  //  verificando usuario conectado
    const {user} = useAuthValue()
    const userLogado = user.uid


   // Referência da coleção de mensagens
    const messageRef= collection(db,"messages");

  // Filtrando mensagens entre o usuário logado e o destinatário selecionado

  // verificação se o destinatario e usuario existe, caso exista preocurar dentro do meu banco utilizando os determinados  metodos
  const messagesQuery = testeId && userLogado ?  query(
    // determinando o banco
    messageRef,
    // minhas buscas
    where("recipientId", "in", [userLogado, testeId]),
    where("uid", "in", [userLogado, testeId]),
    // me devolvendo da mais nova para a mais antiga mensagem
    orderBy("createdAt", "desc") 
  ):null ;

  // Usando o hook para pegar as mensagens
  const [messages] = useCollectionData(messagesQuery, { idField: "id" });


   // Estado para armazenar valor do input e o destinatário
   const [formValue, setFormValue] = useState('');
   const [users, setUsers] = useState([]); // Armazena lista de usuários
 console.log(users)
  
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
            // definindo para qual destinatario enviar a mensagem
            recipientId: testeId, // Inclui o recipientId
            photoURL,
            createdAt: serverTimestamp()

           
        })

        setFormValue('')
    }
    console.log(testeId)

  return (
    <div className={style.ContainerMessage}>
      <section className={style.userSection}>
         <h1>teste</h1>
      </section>
    <section className={style.chatMessage}>
    {testeId && userLogado ? (

     
  <div>
    
    <div className={style.messageContainer}>
      {/* Renderizando as mensagens */}
      {messages && messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className={style.message}>
            <strong className={msg.uid === userLogado ? style.teste : style.teste2}>{msg.uid === userLogado ? "Você"   : users.find(u => u.id === msg.uid)?.name}:</strong>
            <p>{msg.text}</p>
            {msg.photoURL && <img src={msg.photoURL} alt="Profile" />}
          </div>
        ))
      ) : (
        <p>Nenhuma mensagem encontrada.</p>
      )}
    </div>

  </div>
) :  <div className={style.notMessage}>
   <h1> Nenhuma conversa encontrada</h1>
  <p> Selecione um destinatario!!</p>
  </div>}
    </section>
    <section className={style.InputMessage}>
      
    <div className={style.formMessage}>
      <form onSubmit={HandleMessage}>
        <input
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button  type="submit" > enviar</button>
      </form>
    </div>
    </section>
  </div>
  );
};

export default Message;

