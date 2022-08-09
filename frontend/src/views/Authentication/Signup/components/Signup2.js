import { useHttpClient } from "../../../customHooks/httpHook";
import { CircularProgress } from "@material-ui/core";
import React from "react";
import style from "../assets/styles/signup2.module.css";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Signup2 = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const SignupData = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    //console.log(formdata);
    // sendRequest("http://localhost:9000/api/auth/signup"
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/auth/signup",
      "POST",
      JSON.stringify(Object.fromEntries(formdata)),
      {
        "Content-Type": "application/json",
      }
    )
      // fetch("http://localhost:9000/api/auth/signup", {
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
      <div className={style.container1}>
        <div className={style.container2}>
          <h1>Register To Your Account</h1>
          <h4 style={{ marginTop: "5px" }}>welcome BACK , find your friends</h4>
        </div>
        <form onSubmit={SignupData} className={style.container6}>
          <input
            className={style.container3}
            type="text"
            name="name"
            placeholder="Name"
          />
          <input
            className={style.container3}
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className={style.container3}
            type="password"
            name="password"
            placeholder="Password"
          />
          <div style={{ display: "flex" }}>
            {isLoading && <CircularProgress style={{ color: "blueviolet" }} />}
            <button className={style.button}>
              <span>Register </span>
            </button>
          </div>
        </form>
        <div className={style.container4}>
          <h3>
            Already Registered?
            <NavLink style={{ textDecoration: "none", color: "white" }} to="/">
              {" "}
              Login
            </NavLink>
          </h3>
        </div>
      </div>
      <div className={style.container5}>
        <span>OR</span>
      </div>
      <div
        style={{
          marginTop: "12px",
          padding: "2px",
          color: "slateblue",
          fontWeight: "bold",
          fontStyle: "italic",
        }}
        className={style.container5}
      >
        <div>
          <a
            href={process.env.REACT_APP_APIURL + "/auth/google"}
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <img
              style={{ width: "23px" }}
              src="https://img.icons8.com/color/50/000000/google-logo.png"
            />
            Register With Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup2;
