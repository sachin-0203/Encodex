import React, { useState } from "react";
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
} from "lucide-react";

function Dashboard() {
  const [theme, setTheme] = useState(false);
  const [activePage, setActivePage] = useState('encrypt');

  const handleButtonClick = (page) =>{
    setActivePage(page);
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
          onClick={() => setTheme((curr) => !curr)}
          icon={theme ? <Moon size={20} /> : <Sun size={20} />}
          text={theme ? "Dark" : "Light"}
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

      <div id="main-container" className="flex flex-grow-1 ml-16  h-screen">
        <div className="w-full p-3 pt-0">
          <div className="flex justify-between border border-gray-700 mt-1 p-1">
            <h2 className="text-xl text-accent-dark">Search Bar</h2>
            <h2>Profile Icon</h2>
          </div>

          <div className="border-2 border-blue-950 h-16  w-full my-2 flex justify-between align-middle p-1">
            <div>
              <h2>Hello user,</h2>
              <h2 className="text-xl">Welcome Back</h2>
            </div>
            <div className="text-right">
              <h2>12:19:50 PM</h2>
              <h2>
                <span>Sun</span> 11 DEC 2024
              </h2>
            </div>
          </div>

          <div className="flex gap-2 mt-2 h-3/4 box-content">
            <div className="lg:w-3/4 w-full">
              <div className="flex justify-evenly border-2">
                <h2
                  onClick={()=> handleButtonClick('encrypt')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage === 'encrypt'? 'bg-background-dark text-text-light': ''}  
                  `}
                >
                  Encryption
                </h2>
                <h2
                  onClick={()=> handleButtonClick('decrypt')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage ==='decrypt'? 'bg-background-dark text-text-light': ''}
                  `}
                >
                  Decryption
                </h2>
                <h2 
                  onClick={()=> handleButtonClick('message')}
                  className={`
                    border border-gray-500 p-3 my-2 rounded-md hover:bg-background-dark hover:text-text-light cursor-pointer
                    ${activePage === 'message'? 'bg-background-dark text-text-light': ''}  
                  `}
                >
                  Message
                </h2>
              </div>

              {/* Data-Container */}
              <div id="data-container" className=" border-2 border-violet-600 p-2 pb-0">
                  {activePage === 'encrypt' && <EncryptPage />}
                  {activePage === 'decrypt' && <DecryptPage />}
                  {activePage === 'message' && <MessagePage />}
              </div>
            </div>

            {/* Notification , History */}
            <div className="hidden lg:block border border-green-600 w-1/4 text-center">
              <div className="h-full">
                <div className="border h-1/2  w-full overflow-auto">
                  <h2 className="text-lg border">History</h2>
                  <div>
                    <ul>
                      <li>This is History-1</li>
                      <li>This is History-2</li>
                      <li>This is History-3</li>
                      <li>This is History-4</li>
                      <li>This is History-5</li>
                      <li>This is History-6</li>
                      <li>This is History-7</li>
                      <li>This is History-8</li>
                      <li>This is History-9</li>
                    </ul>
                  </div>
                </div>

                <div className="border h-1/2 overflow-auto">
                  <h2 className="border text-lg">Notification</h2>
                  <ul>
                    <li>This is Line-1</li>
                    <li>This is Line-2</li>
                    <li>This is Line-3</li>
                    <li>This is Line-4</li>
                    <li>This is Line-5</li>
                    <li>This is Line-6</li>
                    <li>This is Line-7</li>
                    <li>This is Line-8</li>
                    <li>This is Line-9</li>
                  </ul>
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
