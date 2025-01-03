import React, { useState } from "react";
import { useAuthValue } from "../../Context/AuthContext";
import style from "../Home/Home.module.css";

import SideBar from "../../component/SideB/SideB";
import Message from "../../component/Message/Message";
import useConecct from "../../useConect";

const Home = () => {
  const [recipientId, setRecipientId] = useState(null);

  const handleRecipientIdChange = (newRecipientId) => {
    setRecipientId(newRecipientId); // Atualiza o estado do pai
  };
  useConecct()

  const { user } = useAuthValue();

  return (
    <div className={style.homePage}>
      <div className={style.home}>
      
        <div className={style.socialSection}>
          <section className={style.sidebarSection}>
            {" "}
            <SideBar onRecipientIdChange={handleRecipientIdChange} />
          </section>
          <section className={style.messageSection}>
            {" "}
            <Message testeId={recipientId} />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
