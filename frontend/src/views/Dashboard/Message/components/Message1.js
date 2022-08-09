import { Avatar } from "@material-ui/core";
import React, { useEffect, useContext, useState, useRef } from "react";
import { useHttpClient } from "../../../customHooks/httpHook";
//import db from  "./frontend/src/firebase/Firebase";
import db from "../../../../firebase/Firebase";
import style from "./../assets/styles/message1.module.css";
import SendIcon from "@material-ui/icons/Send";
import { UserContext } from "../../../customHooks/reducer/UserContext";
const Message1 = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { userDetails } = useContext(UserContext);
  const [conversationId, setConversationId] = useState(null);
  const [friends, setfriends] = useState([]);
  const [chat, setChats] = useState([]);
  const [loading, setIsLoading] = useState(false);
  const userid = userDetails.userId;
  const messageEl = useRef(null);
  const [inpMsg, setInpMsg] = useState("");
  const [currFriendId, setCurrFriendId] = useState(null);
  const [name, setcurrname] = useState("");
  const messageSendHandler = () => {
    // console.log(conversationId);
    const reqData = {
      inpMsg,
      userid,
      currFriendId,
      name,
      timestamp: Date.now(),
    };
    setTimeout(async () => {
      try {
        await db.ref(conversationId).push(reqData);
        setInpMsg("");
      } catch (err) {
        console.log(err);
      }
    }, 500);
  };
  const chatHandler = (friendId) => {
    if (!!friends) {
      const friendIdx = friends.findIndex(
        (friend) => friend.friendid === friendId
      );
      setCurrFriendId(friendId);
      setConversationId(friends[friendIdx].conversationId);
      setcurrname(friends[friendIdx].friendname);
      setChats([]);
    }
  };
  useEffect(() => {
    // sendRequest("http://localhost:9000/api/auth/allfriends/" + userid)
    sendRequest(process.env.REACT_APP_APIURL +"/api/auth/allfriends/" + userid)
      .then((res) => {
        if (res.success) {
          // console.log(res.user);
          setfriends(res.user);
        } else {
          console.log(res.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userid]);
  //getting data from firebase
  useEffect(() => {
    try {
      setIsLoading(true);
      db.ref(conversationId).on("value", (snapshot) => {
        const newMessage = snapshot.val();
        if (!newMessage) return;
        const data = Object.keys(newMessage).map((key) => {
          return newMessage[key];
        });
        console.log(data);
        setChats(data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (messageEl) {
      messageEl.current?.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, [messageEl]);
  return (
    <>
      <div className={style.container}>
        <div className={style.container1}>
          {friends.map((friend) => {
            // console.log(friend.conversationId);
            return (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px 20px",
                  marginTop: "20px",
                  width: "20vw",
                  border: "double",
                }}
              >
                <Avatar
                  style={{ marginLeft: "6px", width: "60px", height: "60px" }}
                  src={friend.friendavatar}
                />
                <button
                  style={{
                    display: "flex",
                    border: "none",
                    alignItems: "center",
                    fontSize: "larger",
                    justifyContent: "none",
                    color: "white",
                    backgroundColor: "#1d1a1c00",
                    margin: "15px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => chatHandler(friend.friendid)}
                >
                  {friend.friendname}
                </button>
              </div>
            );
          })}
        </div>
        <div className={style.container2}>
         
         <div className={style.container5}>
           {chat.map((currchat) => {
             // console.log(currchat);

             if (currchat.userid == userid) {
               return (
                 <div className={style.container4}>
                   <h4>You</h4>
                   <span
                     style={{
                       display: "flex",
                       padding: "2px 2px",
                       fontSize: "large",
                       fontStyle: "italic",
                       position: "relative",
                       bottom: "1.1rem ",
                       color: "#deb887e0",
                     }}
                   >
                     {currchat.inpMsg}
                   </span>
                 </div>
               );
             } else {
               return (
                 <div className={style.container3}>
                   <h4 style={{ display: "flex", justifyContent: "flex-end" }}>
                     {currchat.name}
                   </h4>
                   <span
                     style={{
                       display: "flex",
                       padding: "2px 2px",
                       fontSize: "large",

                       justifyContent: "flex-end",
                       position: "relative",
                       bottom: "1.1rem ",
                       color: "aqua",
                     }}
                   >
                     {currchat.inpMsg}
                   </span>
                 </div>
               );
             }
           })}
         </div>
         <div style={{ display: "flex" }}>
           <input
             className={style.container6}
             type="text"
             placeholder="Write a message...."
             onChange={(e) => setInpMsg(e.target.value)}
             value={inpMsg}
           ></input>
           <button
             style={{
               backgroundColor: "#1a1a1d",
               border: "double",
               borderColor: "#c3073f",
               color: "white",
             }}
             onClick={messageSendHandler}
           >
             Send
           </button>
         </div>
       </div>
     
      </div>
    </>
  );
};

export default Message1;
