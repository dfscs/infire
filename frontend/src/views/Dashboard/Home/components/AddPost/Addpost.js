import { useHttpClient } from "../../../../customHooks/httpHook";
import { UserContext } from "../../../../customHooks/reducer/UserContext";
import { CircularProgress } from "@material-ui/core";
import React, { useContext } from "react";
import style from "../AddPost/addpost.module.css";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
const Addpost = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { userDetails } = useContext(UserContext);
  const history = useHistory();
  const Addonclick = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    formdata.append("id", userDetails.userId);

    //sendRequest("http://localhost:9000/api/v1/post/upload", "POST", formdata)
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/v1/post/upload",
      "POST",
      formdata
    )
      .then((res) => {
        if (res.success) {
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
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
    <>
      <div className={style.container}>
        <div className={style.container1}>
          <h2 style={{ color: "wheat" }}>Add Post</h2>
          <form onSubmit={Addonclick} className={style.container2}>
            <input
              className={style.container3}
              type="text"
              placeholder="Caption"
              name="caption"
            />

            <input className={style.container4} type="file" name="image" />
            <div style={{ display: "flex" }}>
              {isLoading && (
                <CircularProgress style={{ color: "blueviolet" }} />
              )}
              <button className={style.button}>
                <span style={{ color: "white" }}>Add </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Addpost;
