import React from 'react';
import style from "../Assets/styles/Addpost.module.css";
import { NavLink } from "react-router-dom";
const AddPost = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.container1}>
            <h2>Add Post</h2>
            <button className={style.button}>
              <span >
                <NavLink
                  style={{ textDecoration: "none",color:"white" }}
                  exact
                  to="/dash/Addpost"
                >
                  Add Post
                </NavLink>
              </span>
            </button>
        </div>
      </div>
    </>
  );
};

export default AddPost;
