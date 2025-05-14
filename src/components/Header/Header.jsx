import React, {useCallback, useContext, useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {UserRoundPlus, LayoutDashboard, House, HelpCircle, Mail, BookA, Sun, Moon, LogIn, LogOut } from "lucide-react"
import { useTheme } from "../../Context/ThemeContext";
import { useAuth } from "../../Context/AuthContext";

import AuthModal from "../AuthModel/AuthModel";

function Header() {

  const {user, logout} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState("login");

  const {theme, ToggleTheme} = useTheme()
  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);

  useEffect(()=>{

    const handleResize = () =>{
      setIslargeScreen(window.innerWidth>= 1024)
    }
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  }, [])

  const handleBegin = (owner)=>{
    if(owner === user){
      logout()
    }
    else{
      setAuthView('login');
      setShowModal(true);
    }
  }

  useEffect(()=>{
    if(user)
      setShowModal(false);
  }, [user])

  return (
    <header className="shadow-xl sticky z-50 top-0 ">
      <nav 
        className="bg-background text-foreground  px-4 lg:px-6 py-2.5 duration-400 transition-all "
      >
        <div className="flex  justify-between items-center mx-auto max-w-screen-xl align-middle h-[4rem]">

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
          <div className="flex align-middle justify-end gap-5">
            
          <div className="order-2">
            <button
              className={`p-2 text-center bg-signup shadow-inner text-white ${islargeScreen? 'rounded-md': 'rounded-3xl size-9 p-1 mt-[1.27rem]'} `}
              onClick={()=>{
                  handleBegin(user || " ")
              }}
            >
              {user?
                (
                  islargeScreen?  user : "S"
                ):(
                  islargeScreen?  "SignUp / LogIn " : <UserRoundPlus size={20}/>
                ) 
              }
            </button>
            
          </div>

          <div className=" mt-2.5 lg:flex flex-wrap w-auto order-1 " >
            <ul className="flex  mt-5 font-medium sm:flex-row sm:space-x-8 lg:mt-0 ">
              <li>
                <NavLink
                 to="/"
                 className={
                  ({ isActive }) => `
                    block pb-2 px-3
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : "text-foreground"
                    }
                    hover:text-primary 
                    lg:p-0
                    transition-all duration-200
                  `}
                 >
                  { islargeScreen?  "Home" : <House size={20}/> }
                 </NavLink>
              </li>
              {/* <li>
                <NavLink
                 to="/about"
                 className={
                  ({ isActive }) => `
                    block pb-2 px-1
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : "text-foreground"
                    }
                    hover:text-primary 
                    lg:p-0
                    transition-all duration-200
                  `}
                >
                  { islargeScreen?  "About" : <BookA size={20}/>}
                </NavLink>
              </li> */}
              <li>
                <NavLink 
                to="/guide"
                className={
                  ({ isActive }) => `
                    block pb-2 px-3
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : "text-foreground"
                    }
                    hover:text-primary 
                    lg:p-0
                    transition-all duration-200
                  `}
                >
                  { islargeScreen?  "Guide" : <HelpCircle size={20}/> }
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                to="/contact"
                className={
                  ({ isActive }) => `
                    block pb-2 px-3
                    ${isActive 
                      ? "text-primary border-b border-ring" 
                      : "text-foreground"
                    }
                    hover:text-primary 
                    lg:p-0
                    transition-all duration-200
                  `}
                >
                  { islargeScreen?  "Contact" : <Mail size={20}/> }
                </NavLink>
              </li> */}
              <li>
                <button onClick={ToggleTheme}>
                  {theme === 'light'? <Sun size={20}/> : <Moon size={20}/>}
                </button>
              </li>
              
            </ul>
          </div>
          
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;