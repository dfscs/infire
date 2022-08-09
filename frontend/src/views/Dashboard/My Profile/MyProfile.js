import React from "react";
import Myprofile from "./components/Myprofile";

import Navbar from "../components/Navbar/Navbar";
import style from "../My Profile/assets/styles/main.module.css";
const MyProfile = () => {
  return (
    <>
      <div className={style.container}>
        <Navbar />
        <Myprofile />
      </div>
    </>
  );
};

export default MyProfile;
