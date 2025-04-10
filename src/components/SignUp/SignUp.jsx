import React, {useState} from "react";
import axios from "axios";

export default function SignupForm() {

  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userpassword, setUserpassword] = useState("");
  
  const handleUsername= (e)=>{
    setUsername(e.target.value)
  }
  const handleUseremail= (e)=>{
    setUseremail(e.target.value)
  }
  const handleUserpassword= (e) => {
    setUserpassword(e.target.value)
  }

  
  const handleSignup = async (e) => {
    e.preventDefault();
    if(!username || !useremail || !userpassword){
      alert("User data is missing!")
      return;
    }
    const formData = new FormData();
    formData.append("username", username )
    formData.append("email", useremail)
    formData.append("password", userpassword)

    try{

      const response = await axios.post("http://127.0.0.1:5000/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data 
      if(result.status === 'success'){
        alert(result.message)
      }
    }
    catch(error){
      if(error.response){
        alert(error.response.data.message)
      }
      else{
        alert('Something went wrong. Please try again.')
      }
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
          onChange= {handleUsername}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={useremail}
          onChange= {handleUseremail}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          value={userpassword}
          onChange= {handleUserpassword}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
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

