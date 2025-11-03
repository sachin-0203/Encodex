import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BadgeCent, BadgeCheck, Loader2, MailPlus } from "lucide-react";
import BACKEND_URL from '../../../config'
import { resendVerification, updateEmail } from "@/api/userUtils";

export const Setting = () => {

  const {userId, user, setUser, userEmail, profileSrc, accessToken, setProfileSrc, username, Isverified } = useAuth();

  const [loading1 , setLoading1] = useState(false);
  const [loading2 , setLoading2] = useState(false);
  const [email, setEmail] = useState(userEmail || " ");


  const [users, setUsers] = useState({
    name: user || " ",
    status: Isverified? 'Verified' : 'Not Verified' ,
  })

  const options = [
    { title : 'General'},
    { title : 'Security'},
    { title : 'Preference'},
  ]

  useEffect(() => {
    if (user) {
      setUsers({
        name: user,
        status: Isverified? "Verified" : "Not Verified " , 
      });
    }
  }, [user]);
  
  const handleProfileChange = async(event) => {

    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('profile_pic', file);

    try{
      
      const response  = await axios.post(`${BACKEND_URL}/upload_profile_pic`,  formData
      , {
        headers : {
          Authorization : `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      const res = response.data;
      if(res.status){
        
        setProfileSrc(res.image_url);
        toast.success(res.message);
        console.log(profileSrc)

      }
      else{
        console.error(res.message)
      }
    }
    catch(error){
      console.error('Upload Failed', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleChanges = async (userid, new_name) => {

    if (!users.name.trim()) {
      toast.warning("Name cannot be empty.");
      return;
    }


    if(user === users.name){
      toast.warning("Enter new name")
      return ;
    }

    try{

      const response = await axios.post(`${BACKEND_URL}/update_user_info`, 
        { 'id': userid, 'name': new_name, 'email': userEmail },
        {
          headers : {
          Authorization : `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
          withCredentials: true,
        }
      )
      const result = response.data;
      if(result.status === 'success'){
        toast.success("sucess: Update Changes")
        setUser(result.username)
      }
      else(
        toast.error(result.message)
      )

    }
    catch(err){
      toast.error("error: Not update changes ")
      console.error("error", err)
    }
  }

  const handleUpdateEmail = async ()=>{
    try{
      setLoading1(true)
      const result = await updateEmail(email,accessToken);
      toast.success(result.message);
    }
    catch(errmsg){
      toast.error(errmsg)
    }
    finally{
      setLoading1(false)
    }
  }
  


  const handleResend = async () => {
    try{
      setLoading2(true)
      const result = await resendVerification(accessToken);
      toast.success(result.message);
    }
    catch(errmsg){
      toast.error(errmsg);
    }
    finally{
      setLoading2(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>

        <div className="mx-2">  

          <div className="text-3xl py-2">

            <div id="banner-dp" className="mb-[8rem]  ">
              <div className="px-2">
                <div className="relative "> 
                  <img src="/assets/Banner.png" alt="banner" className="h-[130px] w-full rounded-md object-cover " />
                  <div className="absolute top-[6rem] left-6 ">

                    <div className="relative group flex align-middle gap-3">

                      <div>
                        <img className="rounded-full border-4 border-background min-w-[5rem] size-24 sm:size-32 " src={profileSrc} alt="dp" />

                        {/* Hover overlay with pencil icon */}
                        <div className="flex justify-center border rounded-md hover:scale-95  ">
                          <label htmlFor="profile_pic" className="cursor-pointer text-[0.7rem] sm:text-sm font-medium  ">
                            Profile pic 
                          </label>
                          <input 
                            id="profile_pic" 
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleProfileChange} 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-10">
                        <h2 className=" text-[1.2rem] sm:text-3xl md:text-4xl ">
                          {user}
                        </h2>

                        <h4 className=" text-[12px] sm:text-lg ">
                          {username}
                        </h4>
                      </div>

                    </div>
              
                  </div>
                </div>
              </div>
            </div>


            <div id="setting" className="mt-10 mx-auto p-6 w-full">

              <div className="mb-6">
                <h2 className="text-3xl sm:text-4xl font-semibold ">
                  Profile Setting
                </h2>
              </div>
              <div className="flex flex-col md:flex-row gap-3 w-full text-sm">

                <div className="flex flex-col w-full md:w-1/2">
                  
                  {/* Name */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="name" className="w-32    text-lg sm:text-xl font-medium ">Name</label>
                    <input
                      id="name"
                      type="text"
                      value={users.name || ''}
                      onChange={(e) => {
                        setUsers(prev => ({
                          ...prev,
                          name: e.target.value,
                        }));
                      }}
                      placeholder="Enter your name"
                      className="flex-1 p-1 border rounded text-black w-full sm:w-[80%] text-sm sm:text-md"
                    />
                  </div>

                   {/* status */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md ">
                    <label htmlFor="purpose" className="w-32  text-lg sm:text-xl  font-medium">Status</label>
                    <div className="w-full sm:w-[80%] flex relative" >
                      <input
                        id="purpose"
                        type="text"
                        value={users.status}
                        className={`flex-1 p-1 border rounded ${Isverified? "text-secondary":"text-red-600 "}  w-full text-sm sm:text-md  outline-none`}
                        readOnly
                      />
                      {Isverified ? (
                        <>
                          <BadgeCheck className="absolute right-1 top-1 text-secondary size-5" />
                        </>
                        ):(
                          <div>
                            <div className="absolute right-1 top-1 cursor-pointer  active:scale-90 " onClick={handleResend} disabled={loading2} >
                            {loading2? (
                              <Loader2 className="animate-spin mr-1" size={16} />
                            ):(
                              
                              <div className="border bg-accent px-1 text-sm rounded-sm">
                                verify
                              </div>
                              
                            )}
                            </div>
                          </div>
                      )}
                      
                    </div>
                  </div>

                </div>

                <div className="flex flex-col w-full md:w-1/2">

                 {/* Username */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="username" className="w-32  text-lg sm:text-xl  font-medium ">Username</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      placeholder="Enter your username"
                      readOnly
                      className="flex-1 p-1 border rounded text-gray-800 w-full sm:w-[80%]  text-sm sm:text-md outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="email" className="w-32  text-lg sm:text-xl  font-medium ">Email</label>
                    <div className="flex relative cursor-pointer w-full sm:w-[80%] ">
                      <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" name="email" id="email" className=" w-full h-7  text-black mt-1 rounded-sm  border outline-ring pl-2  " disabled={Isverified}  />
                      
                      {Isverified? (
                        ""
                      ):(
                        <>
                          <div className="absolute right-0  top-2 text-black text-[12px] px-1 peer active:scale-95" onClick={handleUpdateEmail} disabled={loading1}>
                            {loading1? (
                              <Loader2 className="animate-spin" size={18} />
                            ):(
                              <MailPlus size={20} />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </div>

              {/* Save Button */}
              <div className="mt-6">
                <button 
                  className="px-5 py-1 bg-green-800 text-white rounded hover:bg-green-900 transition w-full sm:w-28" 
                  onClick={()=>handleChanges(userId ,users.name)}
                >
                  Save
                </button>
              </div>
            </div>


          </div>

        </div>
      </div>
    </>
    
  );
};