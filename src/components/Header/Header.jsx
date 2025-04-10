import React, {useCallback, useContext, useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {UserRoundPlus, LayoutDashboard, House, HelpCircle, Mail, BookA, Sun, Moon, LogIn } from "lucide-react"
import { useTheme } from "../../Context/ThemeContext";


function Header() {
  const {theme, ToggleTheme} = useTheme()
  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);

  useEffect(()=>{

    const handleResize = () =>{
      setIslargeScreen(window.innerWidth>= 1024)
    }
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <header className="shadow-xl sticky z-50 top-0 ">
      <nav className="bg-background-light text-text-dark   px-4 lg:px-6 py-2.5 dark:bg-background-dark dark:text-text-light duration-300 transition-all">
        <div className="flex  justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            {
            islargeScreen? 
            <img className="h-20 pr-3" src="./assets/Logo.png" alt="Logo" />:
            <img className="h-12 md:h-20 max-w-md min-w-sm" src="./assets/icon..png"/>
            }
          </Link>
          <div className="flex justify-between order-2 gap-2">
            <Link
              to="/AuthPage?view=login"
              className="p-2 dark:border dark:border-background-light rounded-md duration-200 transition-all"
            >
            { islargeScreen?  "LogIn" : <LogIn/> }
            </Link>
            <Link 
              to="/AuthPage?view=signup"
              className=" text-text-light p-2 rounded-md bg-background-dark dark:border  dark:border-background-light duration-200 transition-all"
            >
            { islargeScreen?  "Sign-up" : <UserRoundPlus/> }
            </Link>
          </div>

          <div className=" justify-between items-center  lg:flex flex-wrap w-auto order-1 " >
            <ul className="flex  mt-4 font-medium sm:flex-row sm:space-x-8 lg:mt-0 ">
              <li>
                <NavLink
                 to="/"
                 className={({isActive})=>`block pb-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary dark:text-accent-dark border-b border-primary": "text-text-dark"} hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0 dark:text-text-light duration-200 transition-all `}
                 >
                  { islargeScreen?  "Home" : <House/> }
                 </NavLink>
              </li>
              <li>
                <NavLink
                 to="/about"
                 className={({isActive})=>`block pb-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary dark:text-accent-dark border-b border-primary": "text-text-dark"} hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0 dark:text-text-light duration-200 transition-all`}
                 >
                  { islargeScreen?  "About" : <BookA/>}
                 </NavLink>
              </li>
              <li>
                <NavLink 
                to="/guide"
                className={({isActive})=>`block pb-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary dark:text-accent-dark border-b border-primary": "text-text-dark"}  hover:text-primary dark:text-text-white dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0 dark:text-text-light duration-200 transition-all`}
                >
                  { islargeScreen?  "Guide" : <HelpCircle/> }
                </NavLink>
              </li>
              <li>
                <NavLink
                to="/contact"
                className={({isActive})=>`block pb-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary dark:text-accent-dark border-b border-primary": "text-text-dark"}  hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0 dark:text-text-light duration-200 transition-all`}
                >
                  { islargeScreen?  "Contact" : <Mail/> }
                </NavLink>
              </li>
              <li>
                <button onClick={ToggleTheme}>
                  {theme === 'light'? <Sun/> : <Moon/>}
                </button>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;