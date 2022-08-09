import React from 'react';
import style from "../assets/styles/Login1.module.css"
import logo4 from "../assets/Images/logo4.png"
const Login1 = () => {
  return (
      <div className={style.container}>
           <h1 className={style.container1}>WELCOME TO</h1>
           <img className={style.container2} src={logo4} alt="logo"/>
      </div>
  );
};

export default Login1;

