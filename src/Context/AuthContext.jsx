import React, {useState, createContext, useContext, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'sonner';


const AuthContext = createContext({})



export const AuthProvider = ({children})=>{

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  
  const [profile, setProfile] = useState("");

  useEffect(()=>{
    tryRefresh();
  }, [])

  const tryRefresh = async ()=>{
    try{
      const response = await axios.post("http://localhost:5000/refresh", {}, {withCredentials: true,});

      const token = response.data.access_token;
      setAccessToken(token);
      const userRes = await axios.get("http://localhost:5000/me",{
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(userRes.data.username);
    } catch(err){
      setAccessToken(null)
    }
  };

  const login = async (email, password)=>{

    try{

      const response = await axios.post("http://localhost:5000/login",
        {email, password},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      
      const result = response.data;
      if(result.status === 'success'){
        
        const token = result.access_token;
        const userData = result.username;

        setAccessToken(token);
        setUser(userData);

        return { success: true, user: userData };
      }
      else{
        return {success: false, message: result.message || "Login failed"};
      }
      
    } catch(error){
      console.error("Login Failed error:", error.response.data.message);
      return { success: false, message: error.response.data.message };
    } 
  };

  const signup = async (username, email, password)=>{

    try{
      const response = await axios.post("http://localhost:5000/signup",
        { username, email, password },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const result = response.data;
      if(result.status === 'success'){
        return { success: true, user: result.username }
      }

    } catch(error){
      if(error.response.data.status === 'register_error'){
        return {success: false, message: error.response.data.message};
      }
      console.error(`Signup Failed: ${error}`)
      return { success: false, message: "An error occured during signup" };
    }

  };

  const logout = async ()=>{

    setAccessToken(null);
    setUser(null);
    try{
       const res= await axios.post("http://localhost:5000/logout",{}, {
        withCredentials: true,
      });

      if(res.data.status === 'success')
        toast(res.data.message, {
          cancel: {
            label: "Ok",
          }
      })

    } catch(err){
      toast.error(`Logout error: ${err}`);
    }
    

  };


  const value = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    login,
    signup,
    logout,
    profile,
    setProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = ()=> useContext(AuthContext);