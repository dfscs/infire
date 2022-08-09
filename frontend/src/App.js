import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "../src/views/Authentication/Login/Login";
import Signup from "../src/views/Authentication/Signup/Signup";
import Confirmemail from "./views/Authentication/ConfirmEmail/Confirmemail";
import ForgotPassword from "./views/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./views/Authentication/ResetPassword/ResetPassword";
import Googlelogin from "./views/Authentication/Googlelogin/Googlelogin";
import Home from "./views/Dashboard/Home/Home";
import Feedback from "./views/Dashboard/Feedback/Feedback";
import MyProfile from "./views/Dashboard/My Profile/MyProfile";
import Findfriend from "./views/Dashboard/Find Friend/Findfriend";
import Message from "./views/Dashboard/Message/Message";
import UpdateProfile from "./views/Dashboard/My Profile/components/component/updateprofile/UpdateProfile";
import AddPost from "./views/Dashboard/Home/components/AddPost/Addpost";
/////// * context *
import { useAuth } from "../../frontend/src/views/customHooks/authHook";

import { UserContext } from "../src/views/customHooks/reducer/UserContext";
import { useNewsHook } from "../../frontend/src/views/customHooks/newshook";
import { NewsContext } from "./views/customHooks/reducer/NewsContext";
const App = () => {
  const auth = useAuth();
  const [routes, setroutes] = useState(null);
  const news = useNewsHook();
  // const {token}= useAuth();
  // console.log(auth);
  const authContextVal = {
    login: auth.login,
    userDetails: auth.userDetails,
    token: auth.token,
    logout: auth.logout,
  };
  const newsContextVal = {
    newsData: news.newsData,
  };

  useEffect(() => {
    let route = null;
    if (auth.token) {
      route = (
        <Switch>
          <Route exact path="/dash/home">
            <Home />
          </Route>
          <Route exact path="/dash/feedback">
            <Feedback />
          </Route>
          <Route exact path="/dash/MyProfile">
            <MyProfile />
          </Route>
          <Route exact path="/dash/findfriend">
            <Findfriend />
          </Route>
          <Route exact path="/dash/message">
            <Message />
          </Route>
          <Route exact path="/dash/Addpost">
            <AddPost />
          </Route>
          <Route exact path="/dash/Updateprofile">
            <UpdateProfile />
          </Route>
          <Redirect to="/dash/home"></Redirect>
        </Switch>
      );
    } else {
      route = (
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/Signup">
            <Signup />
          </Route>
          <Route exact path="/auth/confirm/:id">
            <Confirmemail />
          </Route>
          <Route exact path="/auth/forgot">
            <ForgotPassword />
          </Route>
          <Route exact path="/auth/reset/:token">
            <ResetPassword />
          </Route>
          <Route exact path="/auth/:token">
            <Googlelogin />
          </Route>
          
          <Redirect to="/"></Redirect>
        </Switch>
      );
    }
    setroutes(route);
  }, [auth.token]);

  return (
    <>
      <ToastContainer
        theme="theme"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        transition={Flip}
        toastStyle={{
          backgroundColor: "#1a1a1d",
          color: "white",
          border: "2px solid #c3073f",
        }}
      />
      <UserContext.Provider value={authContextVal}>
        <NewsContext.Provider value={newsContextVal}>
          <Router>{routes}</Router>
        </NewsContext.Provider>
      </UserContext.Provider>
    </>
  );
};

export default App;
