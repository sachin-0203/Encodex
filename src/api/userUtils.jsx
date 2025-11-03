import axios from "axios";
import BACKEND_URL from "../../config"; 


export const resendVerification = async(accessToken)=>{
  try {
    const response = await axios.post(`${BACKEND_URL}/resend_verification`, {},
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message;
  }
};

export const updateEmail = async (newEmail, accessToken) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/update_email`, 
      { email: newEmail },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to Update Email";
  }
};