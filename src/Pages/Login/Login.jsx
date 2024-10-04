import React, { useState } from "react";
import style from "./Login.module.css";
import { auth, provider } from "../../Firebase";
import { signInWithPopup } from "firebase/auth";
import { PuffLoader } from "react-spinners";

import { serverTimestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";

import IconGoogle from "../../assets/Google - Original.png"

const Login = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const HandleSignin = () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // O usuário foi autenticado com sucesso
        const authenticatedUser = result.user;
        setUser(authenticatedUser);

        const { displayName, email, photoURL, uid } = authenticatedUser;

        // Salva ou atualiza o documento do usuário no Firestore
        setDoc(doc(db, "users", uid), {
          name: displayName,
          email: email,
          photoURL: photoURL || null,
          createdAt: serverTimestamp(),
        })
          .then(() => {
            console.log("Usuário salvo com sucesso no Firestore!");
          })
          .catch((error) => {
            console.error("Erro ao salvar usuário no Firestore:", error);
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
      <section className={style.LoginPrincipal}>
        <p>Bem-vindo.
        Comece sua jornada  em nosso chat virtual!</p>
      </section>

      <section className={style.LoginSegundario}>
        <div className={style.h1LoginSegundario}>
          <h1>Login</h1>
        </div>
        <div className={style.InfoLoginSegundario}>
          <p>Disponivel apenas Login com o Google </p>

          {loading ? (
            <PuffLoader />
          ) : (
            <>
              <button onClick={HandleSignin}> <img src={IconGoogle} alt="" />Sign in with Google</button>
            </>
          )}

<span>
      Acessar Conta Google <a href="https://google.com">Seguir</a>
    </span>
        </div>
      </section>
    </div>
  );
};

export default Login;
