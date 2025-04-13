import React, { useContext, useEffect, useState } from "react";
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
} from "lucide-react";

import { ThemeContext } from "../../Context/ThemeContext";
import { useTheme } from "../../Context/ThemeContext";
import { MyContext } from "../../Context/MyContext";
import LiveClock from "../../components/LiveClock/LiveClock"

function Dashboard() {
  const {messages, history, logMessage} =  useContext(MyContext);
  const {theme,ToggleTheme } = useTheme();
  const [activePage, setActivePage] = useState(localStorage.getItem("active") || 'Encrypt');

  const handleButtonClick = (page) =>{
    setActivePage(page);
    localStorage.setItem("active", page)
    logMessage(`Open ${page} Section`)
  }

  return (

    <div id="Dashboard">
      
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          path="/dashboard"
          alert
        />
        <SidebarItem icon={<Home size={20} />} text="Home" path="/" />
        <SidebarItem
          icon={<HelpCircle size={20} />}
          text="Guide"
          path="/guide"
        />
        <SidebarItem icon={<Bell size={20} />} text="Notification" path="#" />
        <SidebarItem icon={<History size={20} />} text="History" path="#" />
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
          icon={<LogOut size={20} />}
          text="LogOut"
          path="/dashboard"
        />
      </Sidebar>

      <div id="main-container" className="flex flex-grow-1 ml-16  h-screen dark:bg-background-dark  dark:text-accent-light transition-all duration-500">
        <div className="w-full p-3 pt-0">
          <div className="border-2 h-16  w-full my-2 flex justify-between align-middle p-1">
            <div>
              <h2>Hello user,</h2>
              <h2 className="text-xl">Welcome Back😊</h2>
            </div>
            <div className="text-right">
              <LiveClock/>
            </div>
          </div>

          <div className="flex gap-2 mt-2 h-3/4 box-content">
            <div className="lg:w-3/4 w-full">
              <div className="flex justify-evenly border-2">
                <h2
                  onClick={()=> handleButtonClick('Encrypt')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage === 'Encrypt'? 'bg-background-dark text-text-light': ''}  

                  `}
                >
                  Encryption
                </h2>
                <h2
                  onClick={()=> handleButtonClick('Decrypt')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage ==='Decrypt'? 'bg-background-dark text-text-light': ''}
                  `}
                >
                  Decryption
                </h2>
                <h2 
                  onClick={()=> handleButtonClick('Message')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage === 'Message'? 'bg-background-dark text-text-light': ''}  
                  `}
                >
                  Message
                </h2>
              </div>

              {/* Data-Container */}
              <div id="data-container" className=" p-2 pb-0">
                  {activePage === 'Encrypt' && <EncryptPage />}
                  {activePage === 'Decrypt' && <DecryptPage />}
                  {activePage === 'Message' && <MessagePage />}
              </div>
            </div>

            {/* Notification , History */}
            <div className="hidden lg:block w-1/4 text-center">
              <div className="h-full ">
                <div className="border rounded-md border-zinc-950">
                  <h2 className=" font-mono text-lg bg-violet-500 text-white rounded-se-md rounded-ss-md py-2 ">Notifications </h2>
                  <div className="w-full max-w-md bg-violet-100 overflow-auto h-52 rounded-es-md rounded-ee-md  scrollbar-thin  scrollbar-thumb-violet-500  scrollbar-track-violet-200 ">
                    {
                      messages.length > 0 ? (
                        <div className="border-2 text-sm border-l-violet-700  rounded-md">
                          {
                            messages.map((msg,index) =>{
                              return (
                                <p key={index}
                                  className="text-sm  text-gray-800 border-b border-violet-700 py-1 last:border-b-2"
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

                <div className="border rounded-md mt-2 border-zinc-800  w-full">
                  <h2 className="font-mono text-lg border bg-zinc-500 text-white p-1 rounded-ss-md rounded-se-md">History</h2>
                  <div className="bg-zinc-200 overflow-auto h-48 rounded-es-md rounded-ee-md  scrollbar-thin  scrollbar-thumb-zinc-500 scrollbar-track-slate-200">
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
                      No History</p>
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
  );
}

export default Dashboard;
