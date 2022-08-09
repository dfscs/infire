import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Message1 from "../Message/components/Message1"
import style from "../Message/assets/styles/main.module.css";
const Message = () => {
  return (
   <>
    <div className={style.container}>
       <Navbar />
        <Message1 />
    </div>
   </>
  );
};

export default Message;
