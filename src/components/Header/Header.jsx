import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-background-light text-text-dark border-b border-accent-light px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link to="/" className="flex items-center">
            <img className="h-20 pr-3" src="./Logo.png" alt="Logo" />
          </Link>
          <div className="flex  justify-between lg:order-2 gap-2">
            <button>Theme-btn</button>
            {/* <button>Profile-btn</button> */}
            <Link 
            to="#"
            className=""
            >
            Sign-up
            </Link>
          </div>

          <div className=" justify-between items-center w-full lg:flex lg:w-auto lg:order-1" >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                 to="/"
                 className={({isActive})=>`block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary": "text-text-dark"} border-b border-primary hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0`}
                 >Home
                 </NavLink>
              </li>
              <li>
                <NavLink
                 to="/about"
                 className={({isActive})=>`block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary": "text-text-dark"} border-b border-primary hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0`}
                 >About
                 </NavLink>
              </li>
              <li>
                <NavLink 
                to="/guide"
                className={({isActive})=>`block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary": "text-text-dark"} border-b border-primary hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0`}
                >Guide
                </NavLink>
              </li>
              <li>
                <NavLink
                to="/contact"
                className={({isActive})=>`block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-primary": "text-text-dark"} border-b border-primary hover:text-primary dark:hover:text-accent-dark lg:hover:bg-transparent lg:border-0 hover: text-primary lg:p-0`}
                >Contact
                </NavLink>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
