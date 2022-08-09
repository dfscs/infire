import {UserContext} from "../../customHooks/reducer/UserContext"
import { useHttpClient } from "../../customHooks/httpHook";
import React, { useContext, useEffect } from 'react';
import { useParams,useHistory } from 'react-router-dom';
import { CircularProgress } from "@material-ui/core";
import { toast } from 'react-toastify';
const Googlelogin = () => {
    const {login}= useContext(UserContext)
    const {sendRequest,isLoading}= useHttpClient()
    const { token } = useParams();
    const history= useHistory();
    useEffect(async() => {
       //fetch(`http://localhost:9000/api/auth/oauth/${token}`,{
           console.log(token)
    //     fetch(process.env.REACT_APP_APIURL+"/api/auth/oauth/"+token,{
    //           method: "GET",
    //    }) .then((res) => res.json())
       sendRequest(process.env.REACT_APP_APIURL+"/api/auth/oauth/"+token)
       .then((res) => {
        {isLoading && <CircularProgress style={{color:"blueviolet"}}/>}
            if (res.ok) {
                console.log(res)
                
                login(res.data,res.token);
                
           toast.success("Logged In Success", { position: toast.POSITION.TOP_RIGHT });
           
           history.push("/dash/home")
            } else {
                toast.warn("error", { position: toast.POSITION.TOP_RIGHT });
            }
            })
            .catch((err) => {
                console.log(err)
                toast.warn(err, { position: toast.POSITION.TOP_RIGHT });
            })
    },[token])
  return (
   <div>
        
      </div>
  );
};

export default Googlelogin;
