import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const Confirmemail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [success, setsucess] = useState(null);
  const [error, seterror] = useState(null);
  const [ide, setid] = useState(id);
  useEffect(async () => {
    setsucess(null);
    seterror(null);
   // fetch(`http://localhost:9000/api/auth/email/confirm/${id}`)
   fetch(process.env.REACT_APP_APIURL+"/api/auth/email/confirm/" + id)
      .then((res) => res.json())
      .then((res) => {
        if (res.ok) {
          setsucess(res.message);
          toast.success(res.message, { position: toast.POSITION.TOP_RIGHT });
          history.push("/");
        } else {
          seterror(res.message);
          toast.warn(res.message, { position: toast.POSITION.TOP_RIGHT });
          history.push("/");
        }
      })
      .catch((err) => {
        seterror("Something went wrong, Please try again");
        console.log(err);

        toast.error("Something went wrong, Please try again", {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
    setid(null);
  }, [ide]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {!!success ? success : error}
    </div>
  );
};

export default Confirmemail;
