import React from 'react';
import FindFriend from './components/FindFriend';
import Navbar from "../components/Navbar/Navbar"
import style from "../Find Friend/assets/styles/main.module.css";
const Findfriend = () => {
  return (
    <>
        <div className={style.container}>
          <Navbar/>
          <FindFriend/>
        </div>
    </>
  );
};

export default Findfriend;
