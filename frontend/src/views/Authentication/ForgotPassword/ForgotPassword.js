import { useHttpClient } from "../../customHooks/httpHook"
import { CircularProgress } from "@material-ui/core";
import React from "react";
import style from "../ForgotPassword/assets/styles/forgotpassword.module.css";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
const ForgotPassword = () => {
  const {sendRequest,isLoading}=useHttpClient();
  const history = useHistory();
  const setemail = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    //sendRequest("http://localhost:9000/api/auth/email/forgot"
      sendRequest(process.env.REACT_APP_APIURL+"/api/auth/email/forgot"
      ,
      "POST",
      JSON.stringify(Object.fromEntries(formdata)),
      {
        "Content-Type": "application/json",
      }
    )
    // fetch("http://localhost:9000/api/auth/email/forgot", {
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
        <h1>Forgot Password</h1>
      </div>
      <form onSubmit={setemail} className={style.container1}>
        <input
          className={style.container2}
          type="email"
          name="email"
          placeholder="Email"
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

export default ForgotPassword;
