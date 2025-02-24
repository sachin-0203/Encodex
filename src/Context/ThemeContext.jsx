import React, {createContext, useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";

export const ThemeContext = createContext({});

export const ThemeProvider = ({children})=>{
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const {logMessage} = useContext(MyContext)

  
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme])

  const ToggleTheme = ()=>{
    const newTheme = theme === "light"? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme" , newTheme)
    logMessage( newTheme === 'light'? "Light Mode Enable ☀️" : "Dark Mode Enable 🌙");
  }

  return (
    <ThemeContext.Provider value={{theme, ToggleTheme}} >
      {children}
    </ThemeContext.Provider>
  )

  
}

export const useTheme = ()=>{
  return useContext(ThemeContext)
}
