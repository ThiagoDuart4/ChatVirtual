import React from 'react'
import style from '../Loading/Loading.module.css'
import { PuffLoader } from "react-spinners";
const Loading = () => {

  // Meu estado de loading localizado no meu LOGIN com o google
  return (
    <div className={style.ContainerLoading}>
        
            <PuffLoader  color="#36d7b7" size={200}/>
    </div>
  )
}

export default Loading
