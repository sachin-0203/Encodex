import React, {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function SignupForm() {

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");

  const {signup} = useAuth();
  const navigate = useNavigate();
  
  
  const handleSignup = async (e) => {
    e.preventDefault();
    if(!username || !useremail || !userpassword){
      alert("User data is missing!")
      return;
    }
    
    const signup_res =  await signup(username, useremail, userpassword);
    if(signup_res.success){
      alert(`Signup success: ${signup_res.user}, LogIn now!`);
      setUsername("");
      setUseremail("");
      setUserpassword("");
    }
    else{
      alert(`SignUp failed: ${signup_res.message}`);
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-primary mb-1">Create your account on Encodex 🚀</h2>
      <p className="text-sm text-gray-600 mb-4">Let’s get you started!</p>

      <form className="space-y-3 text-text-dark" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={username}
          onChange= {(e)=>{setUsername(e.target.value)}}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={useremail}
          onChange= {(e)=>{setUseremail(e.target.value)}}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={userpassword}
          onChange= {(e)=>{setUserpassword(e.target.value)}}
        />
        <div className="flex items-center text-sm" >
          <input type="checkbox" id="terms" className="mr-2" required />
          <label htmlFor="terms" className="text-text-dark" >
            I agree to the{" "}
            <a href="#" className="text-accent-dark underline">
              Terms & Conditions
            </a>
          </label>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-accent-dark text-white rounded-md hover:bg-primary text-sm font-semibold"
        >
          Sign Up
        </button>
      </form>
    </>
  );
}

