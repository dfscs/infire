import { useHttpClient } from "../../customHooks/httpHook";
import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import style from "./assets/styles/resetpassword.module.css";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
const ResetPassword = () => {
  const { token } = useParams();
  const history = useHistory();
  const { sendRequest, isLoading } = useHttpClient();

  const setpassword = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    sendRequest(
     // `http://localhost:9000/api/auth/email/reset/${token}`,
     process.env.REACT_APP_APIURL+"/api/auth/email/reset/"+token,
      "POST",
      JSON.stringify(Object.fromEntries(formdata)),
      {
        "Content-Type": "application/json",
      }
    )
      //   fetch(`http://localhost:9000/api/auth/email/reset/${token}`, {

      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(Object.fromEntries(formdata)),
      // })
      //   .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
          history.push("/");
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
    <div className={style.container}>
      <div className={style.container3}>
        <h1>Reset Password</h1>
      </div>
      <form onSubmit={setpassword} className={style.container1}>
        <input
          className={style.container2}
          type="password"
          name="pswd"
          placeholder="Password"
        />
        <input
          className={style.container2}
          type="password"
          name="confpswd"
          placeholder="Retype Password"
        />
        <div>
        {isLoading && <CircularProgress style={{color:"blueviolet"}}/>}
          <button className={style.button}>
            <span>{">>"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
