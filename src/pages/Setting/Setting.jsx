import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { BadgeCent, BadgeCheck, BadgeX } from "lucide-react";
import BACKEND_URL from '../../../config'

export const Setting = () => {

  const {userId, user, setUser, userEmail, profileSrc, accessToken, setProfileSrc, username, Isverified } = useAuth();

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

      }
      else{
        console.log("profile change error", res.image_url)
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
      console.log("error", err)
    }
  }

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div>

        <div className="mx-2">  

          <div className="text-3xl py-2">

            <div id="banner-dp" className="mb-[8rem]  ">
              <div className="px-2">
                <div className="relative "> 
                  <img src="src/assets/Banner.png" alt="banner" className="h-[130px] w-full rounded-md object-cover " />
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

              <div className="flex w-full justify-evenly border py-1">
                {options.map((option,idx) =>(
                  <div key={idx}>
                    <div>{option.title}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3 w-full text-sm"> 
                {/* Left Column */}
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

                   {/* Role */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md ">
                    <label htmlFor="purpose" className="w-32  text-lg sm:text-xl  font-medium">Status</label>
                    <div className="w-full sm:w-[80%] flex relative" >
                      <input
                        id="purpose"
                        type="text"
                        value={users.status}
                        placeholder="Purpose of using Encodex"
                        className={`flex-1 p-1 border rounded ${Isverified? "text-secondary":"text-red-600 "}  w-full text-sm sm:text-md  outline-none `}
                        readOnly
                      />
                      {Isverified ? (
                        <BadgeCheck className="absolute right-1 top-1 text-secondary size-5" />
                        ):(
                          <BadgeX className="absolute right-1 top-1 text-red-600 size-5" />
                      )}
                      
                    </div>
                  </div>

                </div>

                {/* Right Column */}
                <div className="flex flex-col w-full md:w-1/2">

                 {/* Username */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="username" className="w-32  text-lg sm:text-xl  font-medium">Username</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      placeholder="Enter your username"
                      readOnly
                      className="flex-1 p-1 border rounded text-gray-800 w-full sm:w-[80%]  text-sm sm:text-md outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="email" className="w-32 font-medium  text-lg sm:text-xl ">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={userEmail || " "}
                      readOnly
                      className="flex-1 p-1 border rounded bg-gray-200 cursor-not-allowed text-gray-800 w-full sm:w-[80%] text-sm sm:text-md outline-none"
                    />
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