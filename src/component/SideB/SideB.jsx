import React from 'react'
import style from '../SideB/SideB.module.css'
import {signOut  } from "firebase/auth"; 
import { auth} from "../../Firebase";
import { useState } from 'react';

const SideBar = () => {

  const [loading,setLoading] = useState(false)

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
   <h1>Teste</h1>
      <button onClick={logout} disabled={loading}>
        {loading ? 'Saindo...' : 'Sair'}
      </button>
    </div>
  )
}

export default SideBar
