import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from '../../config';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(0);

  const message = ["Verifying...", "Verification Failed \n Try Again","Verification Success ✅ \n Login now", "⚠️ Server error. Try again later"]
  

  useEffect(() => {
    if(token){
      handleVerification();
    }
  }, [token]);

  const handleVerification = async ()=>{
    try {
      
      const response = await axios.post(`${BACKEND_URL}/verify`, 
      {
        token
      }, 
      {
        headers: {
          "Content-Type" : "application/json"
        },
      })

      if(response.data.success){
        setStatus(2)
      }
      else{
        setStatus(1)
      }
    } 
    
    catch(error){
      console.error("Failed to verify the user", error)
      setStatus(3)
    }

  }
  
  return (
    <>
      <p className={`flex items-center justify-center h-screen w-full text-center
      ${status == 0 ? "animate-pulse":""}  text-xl `}>
        {message[status]}
      </p>

    </>
  );
  
}
