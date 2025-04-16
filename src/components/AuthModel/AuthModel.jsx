import React, { useState, useEffect } from "react";
import LoginForm from "../Login/LogIn";
import SignupForm from "../SignUp/SignUp";
import { X } from "lucide-react";

export default function AuthModal({ isOpen, onClose, defaultView = "login" }) {
  const [view, setView] = useState(defaultView);

  useEffect(() => {
    if(isOpen)
      setView(defaultView);
  }, [isOpen ,defaultView]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white p-10 rounded-md w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-3xl font-bold text-red-500"
          onClick={onClose}
        >
          <X size={25} />
        </button>

        {/* Toggle Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setView("login")}
            className={`w-1/2 py-2 font-semibold rounded-l-md ${
              view === "login"
                ? "bg-accent-dark text-white"
                : "bg-gray-100 text-text-dark"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setView("signup")}
            className={`w-1/2 py-2 font-semibold rounded-r-md ${
              view === "signup"
                ? "bg-accent-dark text-white"
                : "bg-gray-100 text-text-dark"
            }`}
          >
            Sign Up
          </button>
        </div>

        {view === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}
