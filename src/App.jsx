import { useState,useEffect} from 'react'
import { auth} from "./Firebase";
import {onAuthStateChanged,  signOut  } from "firebase/auth"; 

import Loading from './component/Loading/Loading'
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'

import { AuthProvider } from '../src/Context/AuthContext';

import backgroundImage from '../src/assets/background2.svg';
function App() {



  const [user,setUser] = useState()
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
     setUser(user)
    })
   },[auth])



  const styles = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',    
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat', 
    height: '100vh', 
    width: '100vw'
  };

  return (
    <div className='App' style={styles} >
      <AuthProvider value={{user}}>
      <BrowserRouter>
               <Routes>
               <Route path='/' element={user ? <Home /> : <Navigate to = '/login'/>} />  
               <Route path='/login' element={! user ? <Login /> : <Navigate to = '/'/>} /> 
               </Routes>
               </BrowserRouter>
      </AuthProvider>
             
    </div>
  )
}

export default App
