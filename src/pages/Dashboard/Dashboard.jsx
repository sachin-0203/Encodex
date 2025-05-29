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

          <div className={`text-foreground bg-background transition-opacity duration-[1200ms] ease-linear ${showDashBoard? "opacity-100" : "opacity-0" } rounded-lg `} >

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

            <hr className="my-3" />

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
                <div className="shadow-sm shadow-success rounded-md h-16  w-full my-2 flex justify-between align-middle p-1">
                  <div>
                    <h2 className="text-3xl font-bold text-secondary">
                      Dashboard
                    </h2>
                  </div>
                  <div className="text-right">
                    <LiveClock/>
                  </div>
                </div>

                <div className="flex gap-2 mt-2 h-3/4 box-content">
                  <div className=" w-full">
                    <div className="flex justify-evenly rounded-lg bg-back relative w-full px-2 my-1 h-[4.2rem] sm:px-0">

                      <h2
                        ref={encryptRef}
                        onClick={()=> handlePageChange('Encrypt')}
                        className={`box-border z-10 p-4 m-1
                           cursor-pointer rounded-lg hover:bg-success/10 w-1/3 text-center transition-all text-sm md:text-lg  ${activePage === 'Encrypt'? 'text-white':''}
                        `}
                      >
                        Encryption
                      </h2>

                      <h2
                        ref={decryptRef}
                        onClick={()=> handlePageChange('Decrypt')}
                        className={`box-border z-10 p-4 m-1
                          cursor-pointer rounded-lg hover:bg-success/10 text-foreground w-1/3 text-sm md:text-lg text-center transition-all
                          ${activePage === 'Decrypt'? 'text-white':''}
                       `}
                      >
                        Decryption
                      </h2>
                      
                      <h2 
                        ref={messageRef}
                        onClick={()=> handlePageChange('Message')}
                        className={`box-border z-10 m-1
                           p-4 rounded-lg cursor-pointer text-center hover:bg-success/10 w-[30%] text-sm md:text-lg transition-all
                           ${activePage === 'Message'? 'text-white':''}
                           hidden
                        `}
                      >
                        Message
                      </h2>

                      <motion.div
                        className="absolute h-[3.8em] bg-primary border rounded-lg my-1"
                        animate={underlineStyle}
                        transition={{ type: "spring", stiffness: 200, damping: 30, }}
                      />
                        

                    </div>

                    <div id="data-container" className="border rounded-lg p-2 pb-0 z-4">
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
                  <div className="hidden lg:block w-[30%] text-center">
                    <div className="h-full ">
                      <div className="mb-4 border border-sky-700 rounded-md rounded-b-sm">
                        <h2 className=" font-mono text-lg bg-[hsl(205,73%,34%)] text-white rounded-t-md py-2 ">Notifications </h2>
                        <div className="w-full max-w-md bg-sky-100  overflow-auto h-52 rounded-b-sm ">
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

                      <div className="border border-gray-800 rounded-md mt-2 0  w-full">
                        <h2 className="font-mono text-lg bg-zinc-500 text-white p-1 rounded-t-md">History</h2>
                        <div className="bg-zinc-200 overflow-y-auto h-48 rounded-b-md ">
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
