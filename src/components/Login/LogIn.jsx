import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginForm() {

  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('token')){
      navigate('/dashboard')
    }
  },[])

  const handleLogin = async (e)=>{

    e.preventDefault();

    if(!useremail || !userpassword){
      alert("Icomplete User Data");
      return
    }
    const data = {
      'email': useremail,
      'password': userpassword,
    }

    try{
      const response = await axios.post("http://127.0.0.1:5000/login", data, {
        headers: { "Content-Type": "application/json" },
      });
      
      const result = response.data
      if(result.status === 'success'){
        alert(result.message)
        localStorage.setItem("token", result.access_token)
        localStorage.setItem("username", result.username)
        console.log('Refresh_token:', result.refresh_token)
        navigate('/dashboard')
      }
    }
    catch(error){
      if(error.response){
        alert(error.response.data.message)
      }
      else{
        alert("Something went wrong, Login again!")
      }
    }
  }

  return (
    <>
      <h2 className="text-xl font-bold text-primary mb-1">Welcome back to Encodex 👋</h2>
      <p className="text-sm text-gray-600 mb-4">Please login to continue</p>

      <form className="space-y-3 text-text-dark " onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={useremail}
          onChange={(e)=>{setUseremail(e.target.value)}}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={userpassword}
          onChange={(e)=>{setUserpassword(e.target.value)}}
        />
        <div className="flex justify-end">
          <a href="#" className="text-xs text-accent-dark hover:underline">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-accent-dark text-white rounded-md hover:bg-primary text-sm font-semibold"
        >
          Log In
        </button>
      </form>
    </>
  );
}

