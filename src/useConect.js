import { getDatabase, ref, set, onValue, onDisconnect } from "firebase/database";

import { useAuthValue } from "../src/Context/AuthContext";

 const useConecct = ()  => {

    const { user } = useAuthValue();


  const db = getDatabase();
  const userStatusRef = ref(db, `/onlineStatus/${ user.uid}`);
  const connectedRef = ref(db, '/.info/connected');
 

  onValue(connectedRef, (snapshot) => {
  
    if (snapshot.val() === true) {
 //  setando dentro do meu onlineStatus a valor de true aso o usuario esteja conectado no firebase om o conectedREf(verifiador se esta conetado ou nao no firebase)
      set(userStatusRef, true);  

     
      onDisconnect(userStatusRef).set(false);
    } else {
      // Caso o Firebase indique que o usuário não está conectado
      set(userStatusRef, false);  
      
    }
  });

 }

export default useConecct;

