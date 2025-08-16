import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import Sidebar, { SidebarItem } from "../../components/Sidebar/Sidebar";
import EncryptPage from "../EncryptPage/EncryptPage";
import DecryptPage from "../DecryptPage/DecryptPage";
import MessagePage from "../MessagePage/MessagePage"

import {
  LayoutDashboard,
  Settings,
  LogOut,
  HelpCircle,
  Home,
  Sun,
  Moon,
  Bell,
  History,
  RotateCw,
  ToggleLeft,
  Filter,
  Scale,
} from "lucide-react";

import { useTheme } from "../../Context/ThemeContext";
import { useMyContext } from "../../Context/MyContextProvider";
import { useAuth } from "../../Context/AuthContext";
import LiveClock from "../../components/LiveClock/LiveClock"
import { SkeletonModel1, SkeletonModel2, SkeletonModel3, SkeletonModel4 } from "@/components/SkeleFolder/DashSk";

import { motion, AnimatePresence, transform } from "framer-motion";

function Dashboard() {
  const {logout, accessToken, user} = useAuth();
  const {messages, history} =  useMyContext();
  const {theme,ToggleTheme } = useTheme();

  const [showSkeleton, setShowSkeleton] = useState(false);
  const [showDashBoard,setShowDashBoard] = useState(false);

  const [activePage, setActivePage] = useState(localStorage.getItem("active") || 'Encrypt');

  const [underlineStyle, setUnderlineStyle] = useState({left: 0, width:0 })

  const encryptRef = useRef(null);
  const decryptRef = useRef(null);
  const messageRef = useRef(null);

  const pages = ["Encrypt", "Decrypt", "Message"];
  const [direction, setDirection] = useState(0);
  const [prevPageIndex, setPrevPageIndex] = useState(0);
  const currInd = pages.indexOf(activePage);
  
  const handlePageChange = (page)=>{
    const newIndex = pages.indexOf(page);
    setPrevPageIndex(pages.indexOf(activePage));
    setDirection(newIndex>currInd ? 1 : -1)
    setActivePage(page)
    localStorage.setItem("active", page)
  }


  const getVariants = (direction)=> ({
    initial : {x: direction > 0? 40 : -40, opacity : 0, filter: "blur(5px)" },
    animate : {x:0,  opacity:1, filter: "blur(0)" },
    exit :    {x: direction > 0? 40 : -40, opacity : 0, filter: "blur(5px)" },
  });


  const updateSlider = (key) =>{
    const refMap = {
      Encrypt : encryptRef,
      Decrypt : decryptRef,
      Message : messageRef,
    };
    const ref = refMap[key];

    if(ref?.current){
      const rect = ref.current.getBoundingClientRect();
      const parentRect = ref.current.parentElement.getBoundingClientRect();
      setUnderlineStyle({
        left: rect.left - parentRect.left ,
        width: rect.width ,
      });
    }
  }


  useLayoutEffect(()=>{
      updateSlider(activePage);

      const onResize = ()=>updateSlider(activePage);
      window.addEventListener('resize', onResize);

      return ()=> window.removeEventListener('resize', onResize);
    },[activePage])
  
  useEffect(()=>{
    setShowSkeleton(true);
    
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, 500);
    
    setShowDashBoard(true)
    return ()=> clearTimeout(timer)
  }, [])
  

  return (
    
    <div id="Dashboard">
      {
        showSkeleton? (

          <div id="skl" className='flex' >
            <SkeletonModel1 />
            <div className='space-y-2 px-0.5' >
              <SkeletonModel2 />
              <div className='flex px-0.5' >
                <SkeletonModel3 /> 
                <SkeletonModel4 /> 
              </div>
            </div>
          </div>

        ):(

          <div className={`text-foreground bg-background transition-opacity duration-1000 ease-linear ${showDashBoard? "opacity-100" : "opacity-0" } rounded-lg `} >

            <Sidebar >

            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              path="/dashboard"
              alert
            />

            <SidebarItem
              icon={<Home size={20} />}
              text="Home" path="/"
            />

            <SidebarItem
              icon={<HelpCircle size={20} />}
              text="Guide"
              path="/guide"
            />

            <SidebarItem
              icon={<Bell size={20} />}
              text="Notifications"
              path="#"
              count={messages.length} 
            />

            <SidebarItem 
              icon={<History size={20} />} 
              text="History" path="#" 
              count={history.length}
            />

            <hr className="my-3 border border-gray-600" />

            <SidebarItem
              onClick={ToggleTheme}
              icon={ theme == "dark" ? <Moon size={20} /> : <Sun size={20} />}
              text={ theme== "dark" ? "Dark" : "Light"}
            />

            <SidebarItem
              icon={<Settings size={20} />}
              text="Setting"
              path="/setting"
            />

            <SidebarItem
              onClick={logout}
              icon={<LogOut size={20} />}
              text="LogOut"
              path="/"
            />

            </Sidebar>

            <div id="main-container" 
              className="flex flex-grow-1 ml-16  h-screen text-foreground ">

              <div className="w-full p-3 pt-0">

                <div className="shadow-md rounded-md  w-full sm:my-2 p-1 text-center">
                 <div 
                 className=" mx-auto md:text-4xl text-lg ">
                  Welcome Back,
                  <span className="capitalize text-success">
                    {user}
                  </span>
                 </div>
                 <div className="text-[9px] md:text-lg my-2 md:mx-10">
                  Secure your images with military-grade encryption. Upload, encrypt, and share with confidence.
                 </div>
                 <div className="flex justify-center items-center text-center gap-2">
                  <div className=" text-[7px] sm:px-2 text-secondary bg-success/20 border border-secondary rounded-full">All System Operational</div>
                  <div className=" text-[7px] sm:px-2 text-sky-700 bg-sky-100/20 border border-sky-800 rounded-full">RSA-2048 Encryption Active</div>
                 </div>
                </div>

                <div className="flex mt-2 h-3/4 box-content ">
                  <div className=" w-full">

                    <div className="flex gap-1 justify-evenly items-center rounded-full bg-back relative w-full  my-1 h-[1.5rem]  sm:h-[3rem]">

                      <h2
                        ref={encryptRef}
                        onClick={()=> handlePageChange('Encrypt')}
                        className={`box-border z-10 sm:py-2.5 py-0
                           cursor-pointer rounded-full  hover:border border-success/20 w-full text-center transition-all text-sm md:text-lg  ${activePage === 'Encrypt'? 'text-white':''}
                        `}
                      >
                        Encryption
                      </h2>

                      <h2
                        ref={decryptRef}
                        onClick={()=> handlePageChange('Decrypt')}
                        className={`box-border z-10  sm:py-2.5 py-0
                          cursor-pointer rounded-full hover:border border-success/20 text-foreground  text-sm md:text-lg w-full text-center transition-all
                          ${activePage === 'Decrypt'? 'text-white':''}
                       `}
                      >
                        Decryption
                      </h2>
                      
                      <h2 
                        ref={messageRef}
                        onClick={()=> handlePageChange('Message')}
                        className={`box-border z-10 m-1
                           py-1.5 rounded-lg cursor-pointer text-center hover:bg-success/10 w-[30%] text-sm md:text-lg transition-all
                           ${activePage === 'Message'? 'text-white':''}
                           hidden
                        `}
                      >
                        Message
                      </h2>

                      <motion.div
                        className="absolute h-[1.5rem] sm:h-[3em] bg-primary  rounded-full w-full "
                        animate={underlineStyle}
                        transition={{ type: "spring", stiffness: 200, damping: 30, }}
                      />
                        

                    </div>

                    <div id="data-container" className="overflow-hidden rounded-lg p-2 z-4">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activePage}
                          variants={getVariants(direction)}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          transition={{duration: 0.4}}
                        >
                          {activePage === 'Encrypt' && <EncryptPage />}
                          {activePage === 'Decrypt' && <DecryptPage />}
                          {activePage === 'Message' && <MessagePage />}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Notification , History */}
                  <div className="hidden lg:block w-[30%] text-center  ">
                    <div className="h-full ">

                      <div className="mb-1 border border-sky-700 rounded-md rounded-b-sm">
                        <h2 className=" font-mono text-lg bg-[hsl(205,73%,34%)] text-white rounded-t-md py-2 ">Notifications </h2>
                        <div className="w-full max-w-md bg-sky-100  overflow-auto h-48 rounded-b-sm ">
                          {
                            messages.length > 0 ? (
                              <div className="text-sm">
                                {
                                  messages.map((msg,index) =>{
                                    return (
                                      <p key={index}
                                        className="text-sm  text-gray-800 border-b border-sky-400 py-1 last:border-b-2"
                                      >
                                        {msg}
                                      </p>
                                    );
                                  })
                                }
                              </div>
                            ):(<p className="mt-20 text-zinc-500">No Notification</p>)
                          }
                        </div>
                      </div>

                      <div className=" border border-gray-800 rounded-md mt-2 0  w-full">
                        <h2 className="font-mono text-lg bg-zinc-500 text-white p-1 rounded-t-md">History</h2>
                        <div className="bg-zinc-200 overflow-y-auto h-44 rounded-b-md ">
                        {
                          history.length > 0 ? (
                            <div className="border-2 text-sm border-l-zinc-700 rounded-md">
                              {
                                history.map((msg,index)=>(
                                  <p key={index} className="text-sm text-gray-800 border-b border-zinc-700 py-1 last:border-b-2">
                                    {msg}
                                  </p>
                                ))
                              }
                            </div>
                          )
                          :
                          (
                          <p className="mt-20 text-zinc-500" >
                            No History
                          </p>
                        )
                        }
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default Dashboard;
