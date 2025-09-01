import React, {useState, createContext, useContext, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import BACKEND_URL from '../../config';

const AuthContext = createContext({})



export const AuthProvider = ({children})=>{

  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [Isverified, setIsverified] = useState(false);

  const username = user ?  "@" + user.replace(/\s+/g,'').toLowerCase() : " ";

  const [profileSrc, setProfileSrc] = useState("assets/user.jpg");

  useEffect(()=>{
    tryRefresh();
  }, [])

  const tryRefresh = async ()=>{
    try{
      const response = await axios.post(`${BACKEND_URL}/refresh`, {}, {withCredentials: true,});

      const token = response.data.access_token;
      setAccessToken(token);
      const userRes = await axios.get(`${BACKEND_URL}/me`,{
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserId(userRes.data.id);
      setUser(userRes.data.username);
      setUserEmail(userRes.data.email)
      setProfileSrc(userRes.data.profile || "assets/user.jpg")
      setIsverified(userRes.data.isVerified)
    } catch(err){
      setAccessToken(null)
    }
  };

  const login = async (email, password)=>{

    try{

      const response = await axios.post(`${BACKEND_URL}/login`,
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
        const email = result.email;

        setAccessToken(token);
        setUser(userData);
        setUserEmail(userData);


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
      const response = await axios.post(`${BACKEND_URL}/signup`,
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
        toast.error(error.response.data.message)
        return 
      }
      console.error(`Signup Failed: ${error}`)
      return { success: false, message: "An error occured during signup" };
    }

  };

  const logout = async ()=>{

    setAccessToken(null);
    setUser(null);
    try{
       const res= await axios.post(`${BACKEND_URL}/logout`,{}, {
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
    userId,
    user,
    setUser,
    accessToken,
    setAccessToken,
    login,
    signup,
    logout,
    profileSrc,
    setProfileSrc,
    userEmail,
    username,
    Isverified,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};

export const useAuth = ()=> useContext(AuthContext);