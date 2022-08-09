import { UserContext } from "../../../../../customHooks/reducer/UserContext";
import React, { useContext, useEffect, useState } from "react";
import style from "../MyPost/assets/styles/mypost.module.css";
import img from "../MyPost/assets/images/atul.jpeg";
const MyPost = () => {
  const { userDetails } = useContext(UserContext);
  const [post, setPost] = useState([]);
  const id = userDetails.userId;
  useEffect(async () => {
    // fetch("http://localhost:9000/api/auth/myprofile/" + id)
    fetch(process.env.REACT_APP_APIURL +"/api/auth/myprofile/" + id)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPost(res.post);
          //  console.log(res.post);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  return (
    <>
      <div className={style.container}>
        <h2
          style={{
            color: " aliceblue",
            fontStyle: "italic",
            fontFamily: "emoji",
          }}
        >
          Posts
        </h2>
        <div className={style.container1}>
          {post.map((currphoto) => {
            return (
              <div className={style.container3}>
                <img
                  style={{ width: "80%", height: "75%" }}
                  src={currphoto.image.url}
                />
                {currphoto.caption}
                <span
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-evenly",
                    margin: "3%",
                    color: "bisque",
                  }}
                >
                  <i className="fa fa-heart">{currphoto.likes.length} Likes</i>
                  <i className="fa fa-comment">
                    {currphoto.comments.length} Comments
                  </i>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MyPost;
