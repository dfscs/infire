import React from 'react';
import style from "../assets/styles/signup1.module.css"
import logo1 from "../assets/images/logo1.png"
const Signup1 = () => {
  return (
    <div className={style.container}>
         <h1 className={style.container1}>WELCOME TO</h1>
         <img className={style.container2} src={logo1} alt="logo"/>
    </div>
);
};

export default Signup1;
