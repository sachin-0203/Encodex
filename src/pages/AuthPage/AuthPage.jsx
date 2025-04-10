import { useState, useEffect } from "react";
import SignUp from "../../components/SignUp/SignUp";
import LogIn from "../../components/Login/LogIn";
import AuthWrapper from "../../components/AuthWrapper/AuthWrapper";
import LoginForm from "../../components/Login/LogIn";
import SignupForm from "../../components/SignUp/SignUp";
import { useSearchParams } from "react-router-dom";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const urlView = searchParams.get("view") || "login";
  const [view, setView] = useState("login");

  useEffect(() => {
    setView(urlView);
  }, [urlView]);

  return (
    <AuthWrapper>
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

      {/* Render appropriate form */}
      {view === "login" ? <LoginForm /> : <SignupForm />}
    </AuthWrapper>
  );
}
