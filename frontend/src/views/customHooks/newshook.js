import React, { useState, useEffect } from "react";

export const useNewsHook = () => {
  const [newsData, setNewsData] = useState([]);
  useEffect(() => {
   // fetch("http://localhost:9000/api/news")
     fetch(process.env.REACT_APP_APIURL+"/api/news")
      .then((data) => data.json())
      .then((res) => {
        if (res.ok) {
          setNewsData(res.articles);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
 
  return { newsData };
};