import React from 'react'
import style from '../Loading/Loading.module.css'
import { PuffLoader } from "react-spinners";
const Loading = () => {
  return (
    <div className={style.ContainerLoading}>
        
            <PuffLoader  color="#36d7b7" size={200}/>
    </div>
  )
}

export default Loading
