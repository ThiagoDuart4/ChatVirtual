import React, { useState } from 'react' 
 import style from './Login.module.css'
 import { auth, provider } from "../../Firebase";
 import { signInWithPopup } from "firebase/auth"; 
import { PuffLoader } from 'react-spinners';

import {  serverTimestamp,setDoc,doc} from "firebase/firestore";
import { db } from "../../Firebase";
 
const Login = () => {

    const [user, setUser] = useState(null);
    const [loading,setLoading] = useState(false)
 

     
    
    const HandleSignin = () => {
        setLoading(true)
        signInWithPopup(auth, provider)
        .then((result) => {
          // O usuário foi autenticado com sucesso
          const authenticatedUser = result.user; // Pega o usuário autenticado do resultado
          setUser(authenticatedUser); // Atualiza o estado com o usuário
  
          const { displayName, email, photoURL, uid } = authenticatedUser; // Pega os dados do usuário diretamente de result.user
  
          // Salva ou atualiza o documento do usuário no Firestore
          setDoc(doc(db, 'users', uid), {
            name: displayName, // O nome do usuário
            email: email, // O email do usuário
            photoURL: photoURL || null, // A URL da foto de perfil, se houver
            createdAt: serverTimestamp(), // Timestamp do Firestore
          })
            .then(() => {
              console.log('Usuário salvo com sucesso no Firestore!');
            })
            .catch((error) => {
              console.error('Erro ao salvar usuário no Firestore:', error);
            });
  
          setLoading(false); // Desativa o estado de loading
        })
        .catch((error) => {
          // Exibir mensagem de erro
          alert(error.message);
          setLoading(false); // Desativa o estado de loading
        });
    };
  return (
     <div className={style.Container}>
        {loading ? (
      <PuffLoader/> 
      ) : (
        <> <h1>Entrar</h1>
        <button onClick={HandleSignin}>Sign in with Google</button></>
       
      )}

     </div>
   
  )
}

export default Login
