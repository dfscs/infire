import React from 'react';
import style from  "../assets/styles/myprofile.module.css"
import MyProfile from "../components/component/MyProfile/MyProfile"
import MyPost from "../components/component/MyPost/MyPost"
const Myprofile = () => {
  return (
    <>
        <div className={style.container}>
            <MyProfile/>
            <MyPost/>
        </div>
    </>
  );
};

export default Myprofile;
