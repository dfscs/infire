import { useHttpClient } from "../../../customHooks/httpHook";
import { NewsContext } from "../../../customHooks/reducer/NewsContext";
import React, { useEffect, useState, useContext } from "react";
import { CircularProgress } from "@material-ui/core";
import style from "../Assets/styles/home.module.css";
import img from "../Assets/images/atul.jpeg";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteSharpIcon from "@material-ui/icons/DeleteSharp";
import SendIcon from "@material-ui/icons/Send";
import { toast } from "react-toastify";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { UserContext } from "../../../customHooks/reducer/UserContext";
import { NavLink } from "react-router-dom";
import { Avatar } from "@material-ui/core";
const Home1 = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { userDetails } = useContext(UserContext);
  const { newsData } = useContext(NewsContext);
  console.log(newsData);

  const userid = userDetails.userId;
  const [post, setpost] = useState([]);
  const [like, setlike] = useState([]);
  const [delete1, setdelete] = useState(false);
  const [comment, setcomment] = useState("");
  useEffect(async () => {
    //sendRequest("http://localhost:9000/api/v1/post/findfollowedpost/" + userid)
    sendRequest( process.env.REACT_APP_APIURL + "/api/v1/post/findfollowedpost/" + userid)
      .then((res) => {
        if (res.success) {
          //  console.log(res.post);
          setpost(res.post);
        } else {
          console.log("false");
          console.log(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [like, delete1, comment]);

  const deletePost = (id) => {
  //  sendRequest("http://localhost:9000/api/v1/post/delete/" + id + "," + userid)
      sendRequest( process.env.REACT_APP_APIURL + "/api/v1/post/delete/" + id + "," + userid)
      .then((res) => {
        //console.log(2);
        if (res.success) {
          //  console.log(res);
          setdelete(true);
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
        } else {
          //  console.log(res);
          toast.warn(res.message, { position: toast.POSITION.TOP_RIGHT });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likePost = (id) => {
    // sendRequest(
    //   "http://localhost:9000/api/v1/post/likeandUnlike/" + id + "," + userid
    // )
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/v1/post/likeandUnlike/" + id + "," + userid
    )
      .then((res) => {
        if (res.success) {
          // console.log(res);
          setlike(res.post);

          //  toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
        } else {
          //console.log(res);
          //  toast.warn(res.message, { position: toast.POSITION.TOP_RIGHT });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const islike = (id) => {
    const requiredpost = post.find((pst) => {
      return pst._id == id;
    });
    return requiredpost.likes.indexOf(userid) >= 0;
  };
  const addcomment = (id) => {
    const data = {
      postid: id,
      userid: userid,
      comment: comment,
    };
    // sendRequest(
    //   "http://localhost:9000/api/v1/post/comment",
    sendRequest(
      process.env.REACT_APP_APIURL + "/api/v1/post/comment",
      "POST",
      JSON.stringify(data),
      {
        "Content-Type": "application/json",
      }
    )
      .then((res) => {
        if (res.success) {
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
        {post.map((currphoto) => {
          // console.log(currphoto);

          return (
            <div className={style.container1}>
              <div className={style.container2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "7px",
                  }}
                >
                  <Avatar style={{backgroundColor:"#c3073f"}} />
                  <h3 style={{color:"white"}}>Name</h3>
                </div>
                {isLoading && <CircularProgress style={{color:"blueviolet"}}/>}
                <HighlightOffIcon
                  style={{ fontSize: "1.8rem",color:"white",padding:"10px",cursor:"pointer" }}
                
                  onClick={() => deletePost(currphoto._id)}
                />
              </div>
              <div className={style.container3}>
                <img className={style.container4} src={currphoto.image.url} />
              </div>
              <div
                style={{
                  display: "flex",
                  width: "72%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    width: "100%",
                    margin: "3%",
                    color:"white"
                  }}
                >
                  {currphoto.caption}
                </span>

                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <i
                    className={style.container5}
                    style={{
                      color: islike(currphoto._id) ? "#c3073f" : "white",
                      cursor: "pointer",
                    }}
                    onClick={() => likePost(currphoto._id)}
                    className="fa fa-heart"
                  >
                    {currphoto.likes.length} 
                  </i>
                  <i className={style.container5} className="fa fa-comment">
                    {currphoto.comments.length} Comments
                  </i>
                </div>
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    marginTop: "8px",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    className={style.container6}
                    type="text"
                    placeholder="Add Comment"
                    onChange={(e) => setcomment(e.target.value)}
                  />

                  <SendIcon style={{color:"whitesmoke"}} onClick={() => addcomment(currphoto._id)} />
                </div>
              </div>
            </div>
          );
        })}
        <span
         className={style.container8}
          style={{
            display: "flex",
            fontSize: "x-large",
            fontStyle: "italic",
            fontFamily: "cursive",
          }}
        >
          News Feed
        </span>
        {newsData.map((currnews, idx) => {
          var date = new Date(currnews.created_date);
          date = date.toString();
          const short = currnews.short_url;
          if (currnews.title && currnews.abstract && currnews.multimedia)
            return (
              <div className={style.container7}>
                <div
                  style={{
                    display: "flex",
                    width: "90%",
                    padding: "14px",
                    flexDirection: "column",
                  }}
                  key={idx}
                >
                  <img
                   className={style.container10}
                    src={currnews.multimedia && currnews.multimedia[0].url}
                  />
                  <h2 style={{color:"white"}}>{currnews.title}</h2>
                  <h3 style={{color:"wheat"}}>{currnews.abstract}</h3>
                  <p style={{color:"#f1c40f"}}>{date}</p>
                  <a
                   className={style.container9}
                    style={{
                      cursor: "pointer",
                      color: "white",
                      textDecoration: "none",
                      display: "flex",
                      borderColor:" #c3073f",
                      marginLeft: "75%",
                      border: "double",
                      padding: "4px",
                      
                    }}
                    href={currnews.short_url}
                    target="_blank"
                  >
                    Read More...
                  </a>
                </div>
              </div>
            );
        })}
      </div>
    </>
  );
};

export default Home1;
