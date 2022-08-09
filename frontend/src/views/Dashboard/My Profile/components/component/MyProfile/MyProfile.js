import React, { useContext, useEffect } from "react";
import style from "../MyProfile/assets/styles/myprofile.module.css";
import { useHttpClient } from "../../../../../customHooks/httpHook";
import PersonAddSharpIcon from "@material-ui/icons/PersonAddSharp";
import { NavLink, useHistory } from "react-router-dom";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { useState } from "react";
import { UserContext } from "../../../../../customHooks/reducer/UserContext";
import { Avatar } from "@material-ui/core";
const MyProfile = () => {
  const { userDetails, logout } = useContext(UserContext);
  const { sendRequest, isLoading } = useHttpClient();
  const history = useHistory();
  // console.log(userDetails)
  const [user, setUser] = useState({});
  const id = userDetails.userId;

  //console.log(id);
  useEffect(() => {
    // sendRequest("http://localhost:9000/api/auth/mydetail/" + id)
    sendRequest(process.env.REACT_APP_APIURL + "/api/auth/mydetail/" + id)
      .then((res) => {
        if (res.success) {
          console.log(res.user);
          setUser(res.user);
        } else {
          console.log(res.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  // const deleteprofile = (id1) => {
  //   sendRequest(process.env.REACT_APP_APIURL + "/delete/profile/" + id1).then(
  //     (res) => {
  //       if (res.success) {
  //           return 
  //       }
  //     }
  //   )
  //   .catch((err)=>{
  //        console.log(err)
  //   })
    
  // };

  //console.log(user.avatar.url)
  // onClick={() => deletePost(currphoto._id)}
  return (
    <>
      <div className={style.container}>
        <div className={style.container2}>
         
          <Avatar
            style={{
              color: "black",

              width: "200px",
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              margin: "auto",
            }}
            src={user?.local?.avatar?.url}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              padding: "4px 4px",
            }}
          >
            <span style={{ fontSize: "21px", color: "#deb88775" }}>
              <b>{user?.local?.followers?.length}</b> Follower
            </span>
            <span style={{ fontSize: "21px", color: "#deb88775" }}>
              <b>{user?.local?.following?.length}</b> Following
            </span>
          </div>
          <span className={style.container1}>
            Email :- {userDetails.userEmail}
          </span>
          <span className={style.container1}>
            Name :- {userDetails.userName}
          </span>
          <span className={style.container1}>Password :- *********</span>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              margin: "18px",
            }}
          >
            <button className={style.button}>
              <span>
                <NavLink
                  style={{ textDecoration: "none", color: "white" }}
                  exact
                  to="/dash/Updateprofile"
                >
                  Update Profile
                </NavLink>
              </span>
            </button>
            <button className={style.button} onClick={logout}>
              <span>
                <NavLink
                  style={{ textDecoration: "none", color: "white" }}
                  exact
                  to="/"
                >
                  LOGOUT
                </NavLink>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
