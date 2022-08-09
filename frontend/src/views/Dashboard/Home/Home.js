import React from 'react';
import Navbar from "../components/Navbar/Navbar"
import Footer1 from '../components/footer/Footer1';
import style from "../Home/Assets/styles/Main.module.css"
import Home2 from "./components/Home2"
const Home = () => {
  return (
      <div className={style.container}>
      <Navbar/>
       <Home2/>
     </div>
  );
};

export default Home;
