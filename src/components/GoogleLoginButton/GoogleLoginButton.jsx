import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "sonner";

const GoogleLoginBtn = ({ onLogin })=>{


  const handleSuccess = async (credentialResponse)=>{
    const { credential } = credentialResponse;

    try {
      const resp = await axios.post("http://localhost:5000/googleLogin", {token : credential,}, { withCredentials : true, });

      const result = resp.data;
      if(result.status === 'success'){
        toast.success(`Welcome ${result.username}`)
      }
      onLogin({
        token: result.access_token,
        username: result.username,
        dp: result.dp,
      });
      // else{
      //   toast.error(``)
      // }
    }
    catch(error){
      toast.error(`Google Login Failed, ${resp.data.message}`);
      console.error(`Google Login error, ${error}`);
      
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