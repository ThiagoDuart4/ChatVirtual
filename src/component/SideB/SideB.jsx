import React from 'react'
import style from '../SideB/SideB.module.css'
import {signOut  } from "firebase/auth"; 
import { collection ,getDocs,} from "firebase/firestore";
import { auth} from"../../Firebase";
import { useState,useEffect } from 'react';
import { useAuthValue } from "../../Context/AuthContext";
import { db } from "../../Firebase";



const SideBar = ({ onRecipientIdChange }) => {

  const {user} = useAuthValue()
  const userLogado = user.uid

  const [loading,setLoading] = useState(false)

  const [users, setUsers] = useState([]); // Armazena lista de usuários 
  const [buscarRecipientId, setBuscarRecipientId] = useState()
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

   

      // Chama a função do pai quando buscarRecipientId muda
      useEffect(() => {
        onRecipientIdChange(buscarRecipientId); // Envia o ID para o componente pai
    }, [buscarRecipientId, onRecipientIdChange]);

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        // Logout bem-sucedido, agora desativa o loading
        setLoading(false);
        // Adicione outras ações necessárias após o logout (como redirecionamento)
      })
      .catch((error) => {
        // Tratar erro
        alert(error.message);
        setLoading(false); // Desativa o loading mesmo em caso de erro
      });
  };

  return (
    <div className={style.SideBar}>
        <p>{user.displayName}</p>
      <p>{user.email}</p>

      <img src={user.photoURL} alt="Profile" />
   <h1>Teste</h1>
      <button onClick={logout} disabled={loading}>
        {loading ? 'Saindo...' : 'Sair'}
      </button>

        Selecionar destinatário
        <select onChange={(e) => setBuscarRecipientId(e.target.value)}>
            <option value="">Selecione o destinatário</option>
      {users.filter(user => user.id !== userLogado).map(user=>(
        <option key={user.id} value={user.id}>{user.name}</option>
      ))}
        </select>

    </div>
  )
}

export default SideBar
