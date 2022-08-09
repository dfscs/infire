import React from "react";
import style from "../Assets/styles/Home2.module.css";
import Home1 from "./Home1"
import AddPost from "./AddPost";
const Home2 = () => {
  return (
    <>
      <div className={style.container}>
          <Home1/>
         <AddPost/>
      </div>
    </>
  );
};

export default Home2;
