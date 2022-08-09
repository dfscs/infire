import React from 'react';
import style from "../Signup/assets/styles/signup.module.css"
import Signup1 from "../Signup/components/Signup1";
import Signup2 from "../Signup/components/Signup2";

const Signup = () => {
  return (
     <div className={style.container}  >
          <Signup1/>
          <Signup2/>
     </div>
  );
};

export default Signup;

