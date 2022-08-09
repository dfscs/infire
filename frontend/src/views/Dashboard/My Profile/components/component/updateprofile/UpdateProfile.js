import { useHttpClient } from "../../../../../customHooks/httpHook";
import { UserContext } from "../../../../../customHooks/reducer/UserContext";
import React, { useContext } from "react";
import { Avatar, CircularProgress } from "@material-ui/core";
import style from "./updateprofile.module.css";
import { toast } from "react-toastify";
import PersonAddSharpIcon from "@material-ui/icons/PersonAddSharp";
import { useHistory } from "react-router-dom";
const UpdateProfile = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { userDetails, token, login } = useContext(UserContext);
  const id = userDetails.userId;
  const history = useHistory();
  //console.log(userDetails,token)
  const updateandClick = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append("userId", id);
    // sendRequest(
    //   "http://localhost:9000/api/auth/update/profile/",
    sendRequest(
      process.env.REACT_APP_APIURL +"/api/auth/update/profile/",
      "POST",
      formdata
    )
      .then((res) => {
        if (res.success) {
          login(res.userDetails, token);
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
          history.push("/dash/MyProfile");
        } else {
          toast.warn(res.message, { position: toast.POSITION.TOP_RIGHT });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong, Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  return (
    <>
      <div className={style.container}>
        <div className={style.container1}>
          <h2 style={{ color: "aliceblue" }}>Update Profile</h2>
          <form onSubmit={updateandClick} className={style.container2}>
            <input
              type="file"
              id="imgupload"
              style={{ display: "none" }}
              name="image"
            />
            <label for="imgupload">
              <Avatar
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "8px",
                  height: "25vh",
                  cursor: "pointer",
                  width: "20vw",
                  margin: "auto",
                  color: "#c3073f",
                  backgroundColor: "#1a1a1d"
                }}
              />
            </label>

            <input
              className={style.container3}
              type="text"
              placeholder="Update Name"
              name="name"
            />
            <input
              className={style.container3}
              type="text"
              placeholder="Update Email"
              name="email"
            />
            <div>
              {isLoading && (
                <CircularProgress style={{ color: "blueviolet" }} />
              )}
              <button className={style.button}>
                <span>Update </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
