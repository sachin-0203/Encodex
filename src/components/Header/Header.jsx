import React, {useCallback, useContext, useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {UserRoundPlus, House, HelpCircle, Mail, BookA, Sun, Moon, LogOut, Plus, Sparkle, Sparkles } from "lucide-react"
import { useTheme } from "../../Context/ThemeContext";
import { useAuth } from "../../Context/AuthContext";

import AuthModal from "../AuthModel/AuthModel";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../Profile/ProfileMenu";
import { motion, AnimatePresence } from "framer-motion";

function Header() {

  const {user, logout, profileSrc} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState("login");
  
  const {theme, ToggleTheme} = useTheme()
  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{

    const handleResize = () =>{
      setIslargeScreen(window.innerWidth>= 1024)
    }
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(()=>{

    const handleScroll = () =>{
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener("scroll", handleScroll)
    return ()=> window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBegin = (owner)=>{
    if(owner != user){
      setAuthView('login');
      setShowModal(true);
    }
  }

  useEffect(()=>{
    if(user)
      setShowModal(false);
  }, [user])


  const [isDark, setIsDark] = useState(false);
  const rayVariants = {
    hidden: { scaleY: 0, opacity: 1 },
    visible: { scaleY: 2, opacity: 1 }
  };

  return (
    <header className=" sticky z-50 top-0 ">
      <nav 
        className={` ${ scrolled? "bg-signup ":"bg-transparent translate-y-2"}   px-4 lg:px-6 py-2.5 duration-400 transition-all ease-in text-white`}
      >
        <div className="flex  justify-between items-center h-[5rem]">

          <AuthModal
            isOpen={showModal}
            onClose={()=>setShowModal(false)}
            defaultView={authView}
          />

          <Link to="/" className="flex items-center">
            {
              islargeScreen? 
              (
                <h2 className="text-3xl uppercase font-bold  " >Encodex</h2>
              ) :
              (<img className="h-12 md:h-20 max-w-md min-w-sm" src="./assets/icon..png"/>)
            }
          </Link>

          <div className="flex items-center  sm:gap-10 gap-5  ">
            
            <div className="order-2 flex gap-1 ">
              <button
                className={`rounded-full text-center  shadow-inner
                  ${user? '':'bg-signup rounded-md p-2 '}
                  ${islargeScreen? '': ' '}  `}
                onClick={()=>{
                    handleBegin(user || " ")
                }}
              >
                {user?
                  (
                    <ProfileMenu onLogout={logout} />
                  ):(
                    islargeScreen?  "SignUp / LogIn " : <UserRoundPlus size={20}/>
                  ) 
                }
              </button>
              
            </div>
          

            <ul className="order-1 flex items-center gap-5 sm:gap-12  ">

              <NavLink
              to="/plus"
              className={
                ({ isActive }) => `group inline-flex gap-1 items-center
                  ${isActive 
                    ? "text-primary border-b border-ring" 
                    : ""
                  }
                  ${islargeScreen? "":"border-0"}
                  hover:text-primary
                  transition-all duration-200
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`
                    pr-1 fill-none
                    group-hover:fill-current group-[.text-primary]:fill-current
                    transition-colors duration-200
                  `}
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                </svg>

                { islargeScreen?  "Plus" : "" } 
              </NavLink>

              <li>
                <NavLink
                to="/"
                className={
                  ({ isActive }) => `
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : ""
                    }
                    hover:text-primary
                    transition-all duration-200
                  `}
                >
                  { islargeScreen?  "Home" : <House size={20} className="stroke-1"/> }
                </NavLink>
              </li>

              <li>
                <NavLink 
                to="/guide"
                className={
                  ({ isActive }) => `
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : ""
                    }
                    hover:text-primary 
                    lg:p-0
                    transition-all duration-200
                  `}
                >
                  { islargeScreen?  "Guide" : <HelpCircle size={20} className="stroke-1"/> }
                </NavLink>
              </li>

              <li onClick={ToggleTheme} style={{ cursor: "pointer" }}
                className="transform hover:scale-90 transition duration-300"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "light" ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Sun size={23}/>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                      <Moon size={23}/>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

            </ul>

          
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;