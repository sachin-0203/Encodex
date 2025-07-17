import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import { toast, Toaster } from "sonner";

export const Setting = () => {

  const {userId, user, setUser, userEmail, profileSrc, accessToken, setProfileSrc, username, role, setRole } = useAuth();

  const [users, setUsers] = useState({
    name: user || " ",
    role: role || " " ,
  })

  useEffect(() => {
    if (user) {
      setUsers({
        name: user,
        role: role, 
      });
    }
  }, [user]);
  
  const handleProfileChange = async(event) => {

    const file = event.target.files[0];
    const formData = new FormData();

    formData.append('profile_pic', file);

    try{
      
      const response  = await axios.post('http://localhost:5000/upload_profile_pic',  formData
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

  const handleChanges = async (userid, new_name, new_role) => {

    if (!users.name.trim()) {
      toast.warning("Name cannot be empty.");
      return;
  }


    if(user === users.name && new_role === role){
      toast.warning("Enter new name or role")
      return ;
    }

    try{

      const response = await axios.post("http://localhost:5000/update_user_info", 
        { 'id': userid, 'name': new_name, 'role': new_role, 'email': userEmail },
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
        setRole(result.role)
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
                        <div className="flex justify-center border rounded-md  ">
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
                  <div className="border p-2 mb-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-md">
                    <label htmlFor="purpose" className="w-32  text-lg sm:text-xl  font-medium">User Type</label>
                    <input
                      id="purpose"
                      type="text"
                      value={users.role || " "}
                      onChange={(e)=>{setUsers(prev =>({
                        ...prev,
                        role : e.target.value,
                      }))}}
                      placeholder="Purpose of using Encodex"
                      className="flex-1 p-1 border rounded text-black w-full sm:w-[80%] text-sm sm:text-md"
                    />
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
                  onClick={()=>handleChanges(userId ,users.name, users.role)}
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