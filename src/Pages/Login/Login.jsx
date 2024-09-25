import React, { useState } from 'react' 
 import style from './Login.module.css'
 import { auth, provider } from "../../Firebase";
 import { signInWithPopup } from "firebase/auth"; 
import { PuffLoader } from 'react-spinners';
 
const Login = () => {

    const [user, setUser] = useState(null);
    const [loading,setLoading] = useState(false)
 
    
    const HandleSignin = () => {
        setLoading(true)
        signInWithPopup(auth, provider)
            .then((result) => {
                // O usuário foi autenticado com sucesso
              
                setUser(result.user)
                setLoading(false)
            })
            .catch((error) => {
                // Exibir mensagem de erro
                alert(error.message);
                setLoading(false);
            });
    };
  return (
     <div className={style.Container}>
        {loading ? (
      <PuffLoader/> // Ou qualquer spinner ou animação de carregamento
      ) : (
        <> <h1>Entrar</h1>
        <button onClick={HandleSignin}>Sign in with Google</button></>
       
      )}

     </div>
   
  )
}

export default Login
