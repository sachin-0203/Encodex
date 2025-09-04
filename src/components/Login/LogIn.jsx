import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import GoogleLoginBtn from "../GoogleLoginButton/GoogleLoginButton";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export default function LoginForm() {
  const { login, setAccessToken, setUser } = useAuth();

  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();

    
    if (!useremail || !userpassword) {
      toast.error("Incomplete User Data");
      return;
    }
    
    setLoading(true);
    try{
      const res = await login(useremail, userpassword);
  
      if (res.success) {
        toast.success(`Login Success! Hello ${res.user}`);
      } 
      else {
        toast(`Login Failed: ${res.message}`, {
          cancel: { label: "Ok" },
        });
      }
    }
    catch(err){
      toast.error("Login failed! Try agin later ");
    }
    finally{
      setLoading(false);
    }

  };

  return (
    <>
      <h2 className="text-xl font-bold text-primary mb-1">Welcome back to Encodex 👋</h2>
      <p className="text-sm text-gray-600 mb-4">Please login to continue</p>

      <form className="space-y-4 text-black" onSubmit={handleLogin}>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder=" "
            className="peer w-full bg-transparent p-2 border border-gray-400 rounded-md text-base placeholder-transparent focus:border-border outline-none"
            value={useremail}
            onChange={(e) => setUseremail(e.target.value)}
            
          />
          <label
            htmlFor="email"
            className={`absolute left-2 px-1 top-2 text-gray-400 bg-white pointer-events-none transition-all ${
              useremail ? "top-[-11px] text-sm" : ""
            } peer-focus:text-sm peer-focus:text-input peer-focus:top-[-11px] peer-focus:pr-1`}
          >
            Email
          </label>
        </div>

        <div className="relative">
          <input
            id="password"
            type="password"
            placeholder=" "
            className="peer w-full p-2 border border-gray-400 focus:border-border rounded-md text-sm outline-none"
            value={userpassword}
            onChange={(e) => setUserpassword(e.target.value)}
            autoComplete="new_password"
          />
          <label
            htmlFor="password"
            className={`absolute left-2 px-1 bg-white text-gray-400 transition-all ${
              userpassword ? "top-[-11px] text-sm" : ""
            } peer-placeholder-shown:top-1.5 peer-focus:top-[-11px] peer-focus:text-sm peer-focus:text-input peer-focus:px-1`}
          >
            Password
          </label>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-xs text-accent-dark hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className={`w-full py-2 bg-accent-dark text-white rounded-md hover:bg-primary text-sm font-semibold ${ loading? "cursor-not-allowed":"" }`}
        >
          { loading? (
            <>
              <Loader size={20} className="animate-spin mx-auto" />
            </>
          ):(
            <>
              Login
            </>
          )}
        </button>
      </form>

      <div className="mt-4 border rounded-sm">
        <GoogleLoginBtn
          onLogin={({ token, username, dp }) => {
            setUser(username);
            setAccessToken(token);
          }}
        />
      </div>
    </>
  );
}
