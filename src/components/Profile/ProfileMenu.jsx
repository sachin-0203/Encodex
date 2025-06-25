import React, { useState, useRef, useEffect } from "react";
import { User, LogOut, UserCircle, LayoutDashboardIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";

function ProfileMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();
  const {user, profileSrc} = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left  " ref={menuRef}>
      <div
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full"
      >
          <img className=" size-7 border shadow-md rounded-full"  src={profileSrc} alt="profile" />
      </div>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-signup shadow-lg transition-opacity opacity-0 duration-500 ease-out animate-fadeIn ">
          <div className="p-3">
            <div className="p-3  text-center bg-gray-800 rounded-md">
              <div>
                <img className="mb-2 size-12 mx-auto rounded-full"  src={profileSrc} alt="profile" />
              </div>
              <div>{ user}</div>
            </div>
            <div className="mt-5">
              <div  
                onClick={()=>navigate('/dashboard')}
                className="flex w-full items-center px-2 py-2 text-sm rounded-sm hover:bg-gray-800"
              >
                <LayoutDashboardIcon className="w-4 h-4 mr-2 stroke-[1]" />
                Dashboard
              </div>
              <div
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="flex w-full items-center px-2 py-2 text-sm rounded-sm hover:bg-gray-800"
              >
                <UserCircle className="w-4 h-4 mr-2 stroke-[1]" />
                Profile
              </div>
              <div
                onClick={() => {
                  onLogout();
                  setOpen(false);
                }}
                className="flex w-full items-center px-2 py-2 text-sm text-red-400 hover:bg-gray-800 rounded-sm border-t border-gray-700 mt-2"
                >
                <LogOut className="w-4 h-4 mr-2 stroke-[1]" />
                Log Out
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
