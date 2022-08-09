import React from "react";
import Login1 from "./Components/Login1";
import Login2 from "./Components/Login2";
import style from "../Login/assets/styles/Login.module.css";
const Login = () => {
  return (
    <div className={style.container}>
      <Login1 />
      <Login2 />
      
    </div>
    
  );
};

export default Login;
