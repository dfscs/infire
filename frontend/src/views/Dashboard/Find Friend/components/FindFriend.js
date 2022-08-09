import React, { useContext, useEffect, useState } from "react";
import { useHttpClient } from "../../../customHooks/httpHook";
import { UserContext } from "../../../customHooks/reducer/UserContext";
import style from "../assets/styles/FindFriend.module.css";
import img from "../assets/images/atul.jpeg";
import PersonIcon from "@material-ui/icons/Person";
import { toast } from "react-toastify";
import { Avatar } from "@material-ui/core";
const FindFriend = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { userDetails } = useContext(UserContext);
  const [user, setuser] = useState([]);
  const [follower, setfollower] = useState([]);
  const id = userDetails.userId;
  useEffect(() => {
   // sendRequest("http://localhost:9000/api/auth/allprofile")
   sendRequest( process.env.REACT_APP_APIURL +"/api/auth/allprofile")
      .then((res) => {
        if (res.success) {
          console.log(res.user);
          setuser(res.user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [follower]);

  const followuser = (userid) => {
    //sendRequest("http://localhost:9000/api/auth/followAndUnfollow/"+id+","+userid)
    sendRequest(
      process.env.REACT_APP_APIURL +
        "/api/auth/followAndUnfollow/" +
        id +
        "," +
        userid
    )
      .then((res) => {
        if (res.success) {
          console.log(res);
          setfollower(res.user);
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
        } else {
          console.log(res);
          toast.warn(res.message, { position: toast.POSITION.TOP_RIGHT });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const checkfollow = (userid) => {
    const requireduser = user.find((usr) => {
      return usr._id == userid;
    });
    return requireduser.local.followers.indexOf(id) >= 0;
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.container1}>
          {user.map((curruser) => {
            if (curruser._id != id)
              return (
                <div className={style.container2}>
                  <Avatar
                    style={{
                      display: "flex",
                      width: "120px",
                      height: "120px",
                      marginTop: "5%",
                    }}
                    src={curruser?.local?.avatar?.url }
                  />

                  <span style={{ color: "wheat" }} className={style.container3}>
                    {curruser.local.name}
                  </span>
                  <div className={style.container4}>
                    <span style={{ color: "#c39207b0" }}>
                      {curruser.local.followers.length} Follower
                    </span>
                    <span style={{ color: "#c39207b0" }}>
                      {curruser.local.following.length} Following
                    </span>
                  </div>
                  <span style={{ color: "#c39207b0" }}>
                    {curruser.local.posts.length} Post
                  </span>
                  <button
                    className={style.button}
                    onClick={() => followuser(curruser._id)}
                  >
                    <span style={{ color: "white" }}>
                      {checkfollow(curruser._id) ? "following" : "Follow"}
                    </span>
                  </button>
                </div>
              );
          })}
        </div>
      </div>
    </>
  );
};

export default FindFriend;
