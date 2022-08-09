import { useHttpClient } from "../../../customHooks/httpHook";
import { UserContext } from "../../../customHooks/reducer/UserContext";
import { CircularProgress } from "@material-ui/core";
import React, { useContext } from "react";
import style from "../assets/styles/Login2.module.css";
import { NavLink, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const Login2 = () => {
  const { login } = useContext(UserContext);
  const history = useHistory();
  const { sendRequest, isLoading } = useHttpClient();
  const LoginData = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    //console.log(formdata);
    //  sendRequest("http://localhost:9000/api/auth/signin"
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/auth/signin",
      "POST",
      JSON.stringify(Object.fromEntries(formdata)),
      {
        "Content-Type": "application/json",
      }
    )
      .then((res) => {
        if (res.ok) {
          // console.log(res)
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
          login(res.userDetails, res.token);
          // console.log(res.token)

          history.push("/dash/home");
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
          <h1>Login To Your Account</h1>
          <h4
            style={{
              marginTop: "5px",
              color: "lightgrey",
              visibility: "unset",
            }}
          >
            welcome BACK , find your friends
          </h4>
        </div>
        <form onSubmit={LoginData} className={style.container6}>
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
              <span>Login </span>
            </button>
          </div>
        </form>
        <div className={style.container4}>
          <h3>
            Not a member yet?
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to="/signup"
            >
              {" "}
              Register
            </NavLink>
          </h3>
          <h3>
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to="/auth/forgot"
            >
              Forgot Password?
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
        {" "}
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
            <img
              style={{ width: "23px" }}
              src="https://img.icons8.com/color/50/000000/google-logo.png"
            />{" "}
            Login With Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login2;
