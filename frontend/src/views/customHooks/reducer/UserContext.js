import { createContext } from "react";
export const UserContext= createContext({
    userDetails:{},
     setUserdetailsHandler:()=>{},
    isLoggedIn:false,
    token:null,
    login:()=>{},
    logout:()=>{},
   // userPosts:{},
  //  setPostdetailsHandler:()=>{},
    googleLogin:()=>{}
    
});

