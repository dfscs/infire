import React from "react";
import { useHttpClient } from "../../../customHooks/httpHook";
import style from "../Assets/styles/feedback.module.css";
import { toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
const Feeedback = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const feedbackenter = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    //sendRequest("http://localhost:9000/api/auth/feedback",
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/auth/feedback",
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
    <>
      <div className={style.container}>
        <div className={style.container1}>
          <h2 style={{ color: "whitesmoke" }}>We appreciate your Feedback</h2>
          <form onSubmit={feedbackenter} className={style.container2}>
            <input
              className={style.container3}
              type="text"
              placeholder="Email"
              name="email"
            />
            <input
              className={style.container3}
              type="text"
              placeholder="Name"
              name="name"
            />
            <textarea
              className={style.container3}
              rows="2"
              cols="40"
              type="text-area"
              placeholder="Feedback"
              name="description"
            />
            <div style={{ display: "flex", margin: "4%" }}>
              {isLoading && (
                <CircularProgress style={{ color: "blueviolet" }} />
              )}
              <button className={style.button}>
                <span style={{ color: "white" }}>Submit </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Feeedback;
