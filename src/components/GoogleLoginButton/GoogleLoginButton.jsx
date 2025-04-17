import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginBtn = ({ onLogin })=>{


  const handleSuccess = async (credentialResponse)=>{
    const { credential } = credentialResponse;

    try {
      const resp = await axios.post("http://localhost:5000/googleLogin", {token : credential,}, { withCredentials : true, });
      onLogin({
        token: resp.data.access_token,
        username: resp.data.username,
        dp: resp.data.dp,
      });
    }
    catch(error){
      console.error("Google Login error", error);
    }

  };

  return(
    <GoogleLogin 
      onSuccess={handleSuccess} 
      onError={()=> console.log("Google Login Failed")}
      clientId = "907532710684-9ehbdn45tkhmgtrcbkusljdshdq8rd8d.apps.googleusercontent.com"
    />
  );
};

export default GoogleLoginBtn;