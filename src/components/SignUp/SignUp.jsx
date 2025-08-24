import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import GoogleLoginBtn from "../GoogleLoginButton/GoogleLoginButton";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function SignupForm() {

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");

  const {signup, setUser, setAccessToken} = useAuth();
  const navigate = useNavigate();
  
  
  const handleSignup = async (e) => {
    e.preventDefault();
    if(!username || !useremail || !userpassword){
      toast.error("User data is missing!")
      return;
    }
    
    const signup_res =  await signup(username, useremail, userpassword);
    if(signup_res.success){
      toast.success(`Signup success: ${signup_res.user}, LogIn now!`);
      setUsername("");
      setUseremail("");
      setUserpassword("");
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-primary mb-1">Create your account on Encodex 🚀</h2>
      <p className="text-sm text-gray-600 mb-4">Let’s get you started!</p>

      <form className="space-y-3 text-text-dark" onSubmit={handleSignup}>

        <div className="relative">
          <input
            id="userN"
            type="text"
            placeholder=" "
            className="peer w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-border "
            value={username}
            onChange= {(e)=>{setUsername(e.target.value)}}
          />
          <label htmlFor="userN" className={`absolute top-2 left-2 px-1 text-sm bg-white text-gray-500 peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-input peer-focus:pr-1 peer-focus:left-2 ${username? 'top-[-10px] ':''} transition-all `}>Username</label>
        </div>

        <div className="relative">

          <input
            id="userE"
            type="email"
            placeholder=" "
            className="peer w-full p-2 border border-gray-300 rounded-md text-sm focus:border-border outline-none"
            value={useremail}
            onChange= {(e)=>{setUseremail(e.target.value)}}
          />
          <label htmlFor="userE" className={`absolute top-2 left-2 px-1 text-sm bg-white text-gray-500 peer-focus:text-input peer-focus:pr-1 peer-focus:top-[-10px] ${useremail? 'top-[-10px]':''} transition-all `}>Email</label>
        </div>

        <div className="relative">
          <input
            id="userP"
            type="password"
            placeholder=" "
            className="peer w-full p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-border"
            value={userpassword}
            onChange= {(e)=>{setUserpassword(e.target.value)}}
          />
          <label htmlFor="userP" className={`absolute top-2 left-2 px-1 text-sm bg-white text-gray-500 peer-focus:text-input peer-focus:pr-1 peer-focus:top-[-10px] ${userpassword? 'top-[-10px]':''} transition-all `}>Password</label>
        </div>
        
        <div className="flex items-center text-sm" >
          <input type="checkbox" id="terms" className="mr-2" required />
          <label htmlFor="terms" className="text-text-dark" >
            I agree to the{" "}
            <Link 
              to="/terms-and-conditions" className="text-accent-dark underline"
              target="_blank"
            >
              Terms & Conditions
            </Link>
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-accent-dark text-white rounded-md hover:bg-primary text-sm font-semibold"
        >
          Sign Up
        </button>
      </form>
      <div className="mt-3 border rounded-sm">
        <GoogleLoginBtn onLogin={({token, username})=>{
          setUser(username)
          setAccessToken(token)
          navigate("/")
        }}/>
      </div>
    </>
  );
}

