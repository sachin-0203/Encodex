import React, {useCallback, useContext, useEffect, useState} from "react";
import { Link, NavLink } from "react-router-dom";
import {UserRoundPlus, House, HelpCircle, Mail, BookA, Sun, Moon, LogOut, Plus, Sparkle, Sparkles } from "lucide-react"
import { useTheme } from "../../Context/ThemeContext";
import { useAuth } from "../../Context/AuthContext";

import AuthModal from "../AuthModel/AuthModel";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../Profile/ProfileMenu";

function Header() {

  const {user, logout, profileSrc} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState("login");

  const {theme, ToggleTheme} = useTheme()
  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);
  const navigate = useNavigate();

  useEffect(()=>{

    const handleResize = () =>{
      setIslargeScreen(window.innerWidth>= 1024)
    }
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
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
            
          <div className="order-2 flex gap-1">
            <button
              className={`rounded-full h-10 text-center  shadow-inner text-white
                 ${user? '':'bg-signup rounded-md p-2 '}
                 ${islargeScreen? '': ' mt-[1.4rem]'}  `}
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

          <div className=" mt-2.5 lg:flex flex-wrap w-auto order-1 " >
            <ul className="flex  mt-5 font-medium sm:flex-row sm:space-x-8 lg:mt-0 ">
              <li>
                <NavLink
                 to="/plus"
                 className={
                  ({ isActive }) => ` group
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`
                      inline-block pr-1.5 fill-none
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
              </li>
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
              <li>
                <button 
                  onClick={ToggleTheme}
                  
                  >
                  {theme === 'light'? (
                    <Sun size={20}/> 
                    

                    ):(
                    <Moon size={20} />
                    )
                  }
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