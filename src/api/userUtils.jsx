import axios from "axios";

const API_BASE = "http://localhost:5000";


export const resendVerification = async(accessToken)=>{
  try {
    const response = await axios.post(`${API_BASE}/resend_verification`, {},
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
    const response = await axios.post(`${API_BASE}/update_email`, 
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