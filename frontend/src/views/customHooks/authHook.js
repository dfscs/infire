import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userDetails, setUserDetails] = useState({})




  //Local-login saving-token-to-localStorage
  const login = useCallback(
    (Udetail, token, expirationDate) => {
      setToken(token);

      setUserDetails(Udetail)
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        "LoginData",
        JSON.stringify({
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          userDetails:Udetail
          
        })
      );
    },
    []
  );

  // const setVerificationStatus = useCallback((type) => {
  //   if (type === "mobile") {
  //     verification.mobile = true;
  //   } else if (type === "email") {
  //     verification.email = true;
  //   }

  //   const data = JSON.parse(localStorage.getItem("userData"));
  //   console.log(data);
  //   localStorage.setItem(
  //     "userData",
  //     JSON.stringify({
  //       ...data,
  //       verification: verification,
  //     })
  //   );
  // });

  //Google-login
  const googleLogin = useCallback((token, expirationDate) => {
    setToken(token);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  //logout
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    
    localStorage.removeItem("LoginData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    let storedData = null;
    if (!!localStorage.getItem("LoginData")) {
      storedData = JSON.parse(localStorage.getItem("LoginData"));
    }
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userDetails,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login, token]);

  return {
    token,
    login,
    logout,
    userDetails,
   
    googleLogin,
   
  };
};
