import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { Link } from "react-router-dom"

import { useAuth } from "../../Context/AuthContext"

const SidebarContext = createContext()

export default function Sidebar({ children }) {

  const {user} = useAuth();
  const [expanded, setExpanded] = useState(false);
  
  return (
    <aside className="h-screen fixed">
      <nav className="h-full inline-flex flex-col bg-white border-r shadow-sm transition-all duration-500 dark:bg-sky-900 dark:text-text-light">
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
            className="p-1.5 rounded-lg text-text-light bg-background-dark hover:bg-accent-dark"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src="./assets/icon..png"
            alt="fav_icon" 
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user}</h4>
              <span className="text-xs text-lime-500">Active</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert, path, onClick}) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group  dark:text-text-light
        ${
          active
            ? "bg-gray-600 text-text-light"
            : "hover:bg-indigo-100 text-gray-600 dark:hover:bg-background-dark"
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

      { !expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-background-light text-text-dark text-sm
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