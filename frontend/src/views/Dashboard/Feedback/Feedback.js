import React from 'react';
import Navbar from "../components/Navbar/Navbar"
import style from "./Assets/styles/Main.module.css"
import Feeedback from './components/Feeedback';
const Feedback = () => {
  return (


    <div className={style.container}>
    <Navbar/>
    <Feeedback/>
    </div>
    
         
    
  );
};

export default Feedback;
