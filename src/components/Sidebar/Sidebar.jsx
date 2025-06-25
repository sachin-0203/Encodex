import { ChevronLast, ChevronFirst, UserCircle, MoreHorizontalIcon, ChevronRight } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAuth } from "../../Context/AuthContext"

const SidebarContext = createContext()

export default function Sidebar({ children }) {

  const {user, profileSrc, Logout} = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  return (
    <aside className="h-screen fixed z-50">
      <nav className="h-full inline-flex flex-col border-r border-gray-600 shadow-sm transition-all duration-500 bg-sidebarC  text-sidebarT  ">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="./assets/Logo.png"
            className={`overflow-hidden transition-all duration-400 h-12 ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="encodex_logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-md  text-lime-500 hover:bg-ring"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t border-gray-600 flex p-3" >
          <div onClick={()=>navigate('/profile')}>
            <img className=" size-11  rounded-full p-0.5 border border-ring hover:bg-ring"  src={profileSrc} alt="profile" />
          </div>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all  ${expanded ? "w-52 ml-3" : "w-0 hidden"}
          `}
          >
            <div className="leading-4 p-1">
              <h4 className="font-semibold">{user}</h4>
              <span className="text-xs text-accent">Active</span>
            </div>
            <ChevronRight className="hover:ring mr-1 rounded-full cursor-pointer" onClick={()=>navigate('/profile')}  size={25} />
           
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, path, onClick, count}) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group text-sidebarT
        ${
          active
            ? "bg-gray-600 text-text-light"
            : " hover:text-foreground hover:bg-background"
        }
    `}
    >
      <Link to={path} className="flex items-center w-full" onClick={onClick} >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
      </Link>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-lime-500 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {count>0 && (
        <div
          className={`absolute right-1.5 size-5 rounded-xl text-sm text-center bg-accent text-sidebarT  ${
            expanded ? "" : "top-0 right-0 "
          }`}
        >{count}</div>
      )}

      { !expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-sidebarC text-sidebarT  text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}