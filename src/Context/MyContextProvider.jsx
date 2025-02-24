import {React, useState} from "react";
import {MyContext} from "./MyContext";

const MyContextProvider = ({children})=>{
  const [messages, setMessage] = useState([]);
  const [history, setHistory] = useState([]);

  const logMessage = (msg) => {
    setMessage((prevMessages) => [`${msg}`, ...prevMessages]);
  };

  const logHistory = (msg) =>{
    setHistory((prevMessages) => [`${msg}`, ...prevMessages]);
  }

  return (
    <MyContext.Provider value={{messages, logMessage, history, logHistory }}>
      {children}
    </MyContext.Provider>
  )
}

export default MyContextProvider;
