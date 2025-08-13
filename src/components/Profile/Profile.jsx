import React, {useEffect, useState} from "react";
import { useNavigate , Link, NavLink} from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import ImageGallery from "../Gallery/ImageGallery";
import MetadataActivity from "../Gallery/MetaData";
import { toast } from "sonner";
import { UserPen, Plus, Copy } from "lucide-react";


function Profile() {
  const {user, userEmail, userId, accessToken, profileSrc, username, role} = useAuth();

  const navigate = useNavigate()
  const [counts, setCounts] = useState({
    uploads: 0,
    encrypted: 0,
    decrypted: 0,
  });
  const totalImage = 100;
  const uplImg = counts.uploads;
  const encImg = counts.encrypted;
  const decImg = counts.decrypted;
  const uplPercent = (uplImg/totalImage) * 100;
  const encPercent = (encImg/totalImage) * 100;
  const decPercent = (decImg/totalImage) * 100;

  const [keys, setKeys] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [activeButton, setActiveButton] = useState('upload');

  useEffect(() => {
    const fetchImageCounts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/image-counts', {
          headers: {
            Authorization: `Bearer ${accessToken}`  
          }
        });
        setCounts(res.data);
      }
      catch (error) {
        console.error("Failed to fetch image counts", error);
      }
    };

    fetchImageCounts();

  }, []);


  const handleDelete = async (key, idx, userId) => {
    try {
      const response = await axios.post('http://localhost:5000/api/delete-key', 
      {
        key,
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        toast.warning("Deleted: Key ");
        setKeys((prevKeys) => prevKeys.filter((_, i) => i !== idx));
      } else {
        toast.error(`Failed: ${response.data.error || 'Unknown error'}`);
      }

    } catch (err) {
      toast.error("Error deleting key");
      console.error(err);
    }
  };

  const handleButtonClick = (folder) => {
      setSelectedFolder(folder);
      setActiveButton(folder);
      if(folder === 'keys'){
        fetchKeys();
      }
  };

  const fetchKeys = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/keys`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setKeys(res.data);
    } catch (err) {
      console.error("Failed to fetch keys:", err);
    }
  };

  const handleCopyKeyContent = async (keyName) => {
    try {
      const res = await axios.get(`http://localhost:5000/key-content/${keyName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const keyContent = res.data.content;
      await navigator.clipboard.writeText(keyContent);
      toast.success(`Key copied!`);
    } catch (err) {
      toast(`Failed to Copy Key`, {
        cancel: { label: "Ok" },
      });
      console.error("Failed to copy key:", err);
    }
  };


  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);

  useEffect(()=>{
  
      const handleResize = () =>{
        setIslargeScreen(window.innerWidth>= 1024)
      }
      window.addEventListener("resize", handleResize)
      return ()=> window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="Relative flex w-full flex-col sm:flex-row transition-all duration-500 gap-2 p-2">

      {/* Main- Left -section */}
      <div className="shadow-xl  sm:h-[screen] min-w-[14rem] p-2 rounded-md ">

        {/* Left section: image */}
        <div className="sticky top-24 flex flex-row sm:flex-col gap-2 ">
        
          <div className=" basis-1/3 sm:w-100% w-50%  ">
          
            <div className="border mt-2.5 sm:mt-0"> 
              <div className="text-center">Profile</div>
            </div>
            
            <div className="relative group w-fit mx-auto my-4  ">
              <img 
                src={profileSrc} 
                alt="Profile Pic" 
                className={`h-32 w-32 rounded-full object-cover border-2 border-gray-300 shadow-md `}
              />
            </div>

          </div>

          {/* right section: user-info */}
          <div className="basis-2/3  lg:max-w-56 sm:w-full min-w-28">
          
            <div className="border my-2 h-12 flex items-center overflow-hidden text-ellipsis whitespace-nowrap p-2">
              Name: {user}
            </div>
            
            <div className="border my-2 h-12 flex items-center p-2">
              Username: {username}
            </div>

            <div className="border my-2 py-2 break-words overflow-hidden px-2 box-border ">
              Email: {userEmail}
            </div>

            <div className="border my-2 h-12 flex items-center p-2">
              Role: {role || "{your role}"}
            </div>

            <div >
              <Link to="/Setting" className="group border flex  justify-right gap-3 p-2 " >
                
                <UserPen  />
                <h2 className="group-hover:text-gray-600">Edit Profile</h2>
                
              </Link>
            </div>
          </div>
        </div>
      </div>

      

      {/* Main- Right Section */}
      <div className=" basis-4/5 min-h-[85vh] min-w-[14rem] ">

        {/* plus section */}
        <div className="border mb-2 h-12 rounded-sm">
          <NavLink to={'/plus'} className="px-5 py-2 flex justify-between">

            {/* left */}
            <div className="text-lg uppercase ">
              Encode<span className="text-red-500">x</span>
            </div>

            {/* right */}
            <div>
              <Link className="group  flex gap-3 px-2 py-1 bg-secondary rounded-full text-white" onClick={()=> navigate('/Plus')}>
                <div>
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`
                    inline-block fill-none
                    group-hover:fill-current group-[.text-primary]:fill-current
                  `}
                >
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                  <path d="M20 3v4" />
                  <path d="M22 5h-4" />
                  <path d="M4 17v2" />
                  <path d="M5 18H3" />
                  </svg>

                </div>
                <div>
                  Get Plus
                </div>
              </Link>
            </div>
          </NavLink>
        </div>

        {/* Upper Col */}
        <div className="flex flex-grow gap-2 md:flex-row flex-col ">

          {/* right-col-1 : Progress */}
          <div id="Overall Progress" className=" min-h-[16rem] border rounded-sm basis-[65%] mb-2">

            <div className="flex flex-col h-full"  >
              <header className="px-5">
                <div className="my-4 text-lg" >Overall Progress</div>
              </header>
              <div className="px-6 py-10 pt-3 flex-1 h-full overflow-hidden overflow-x-auto no-scrollbar">
                <div className="flex h-full flex-col justify-between items-center space-y-7 ">
                  <div className="flex gap-4 w-full font-dmSans ">
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center">
                        <span>Uploaded Images</span>
                        <span>{uplPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1 bg-progress  rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-primary" style={{width: `${uplPercent}%`}}></div>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">{uplImg}/{totalImage} </div>
                  </div>
                  <div className="flex gap-4 w-full font-dmSans ">
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center">
                        <span>Encrypted Images</span>
                        <span>{encPercent.toFixed(0)}% </span>
                      </div>
                      <div className="w-full h-1 bg-progress rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-primary" style={{width: `${encPercent}%`}}></div>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">{encImg}/{totalImage}</div>
                  </div>
                  <div className="flex gap-4 w-full font-dmSans ">
                    <div className="w-full flex flex-col">
                      <div className="flex justify-between items-center">
                        <span>Decrypted Images</span>
                        <span>{decPercent.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1 bg-progress rounded-full overflow-hidden mt-1">
                        <div className="h-full bg-primary" style={{width: `${decPercent}%`}}></div>
                      </div>
                    </div>
                    <div className="flex justify-end items-center">{decImg}/{totalImage} </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* right-col-2 : Metadata */}
           <MetadataActivity userId = {userId} accessToken={accessToken} />

        </div>

        {/* Lower Col: Image section */}
        <div className="border rounded-t-lg">

          <header 
            className="flex justify-evenly w-full min-w-fit min-h-[2rem] border-b rounded-t-lg px-2 py-2 sm:px-5"
          >
            <div className="flex w-full min-w-fit gap-1 sm:gap-2">
              
              <button 
                onClick={()=>handleButtonClick('uploads')}
                className={`text-sm sm:text-base px-1 py-1 sm:px-2 whitespace-nowrap flex-1 relative outline-none ${activeButton === 'uploads'? 'text-primary':''} `}
              >
                <span >
                  {islargeScreen? "Uploaded Images":"Upload"}
                </span>
                <div 
                  className={`absolute -bottom-2 left-0 w-full h-0.5 bg-primary transition-opacity duration-300  
                  ${activeButton === 'uploads'? ' opacity-100':' opacity-0'}`}></div>
              </button>

              <button 
                onClick={()=>handleButtonClick('encrypted')}
                className={`text-sm sm:text-base px-1 py-1 sm:px-2 whitespace-nowrap flex-1 relative outline-none ${activeButton === 'encrypted'? 'text-primary':''} `}
              >
                <span >
                  {islargeScreen? "Encrypted Images":"Encrypt"}
                </span>
                <div 
                  className={`absolute -bottom-2 left-0 w-full h-0.5 bg-primary transition-opacity duration-300
                  ${activeButton === 'encrypted'? ' opacity-100':' opacity-0'}
                  `} ></div>
              </button>
              
              <button 
                onClick={()=> handleButtonClick('decrypted')}
                className={`text-sm sm:text-base px-1 py-1 sm:px-2 whitespace-nowrap flex-1 relative outline-none ${activeButton === 'decrypted'? 'text-primary':''} `}
              >
                <span >
                  {islargeScreen? "Decrypted Images":"Decrypt"}
                </span>
                <div 
                  className={`absolute -bottom-2 left-0 w-full h-0.5 bg-primary transition-opacity duration-300  
                  ${activeButton === 'decrypted'? ' opacity-100':' opacity-0'}`}></div>
              </button>

              <button 
                onClick={()=>handleButtonClick('keys')}
                className={`text-sm sm:text-base px-1 py-1 sm:px-2 whitespace-nowrap flex-1 relative outline-none ${activeButton === 'keys'? 'text-primary':''} `}
              >
                <span >
                  {"Keys"}
                </span>
                <div 
                  className={`absolute -bottom-2 left-0 w-full h-0.5 bg-primary transition-opacity duration-300  
                  ${activeButton === 'keys'? ' opacity-100':' opacity-0'}`}></div>
              </button>
            </div>

          </header>

          <div className="min-h-[13rem]">
            
            { activeButton === 'keys'? (
              // keys
              <div className="  text-center">
                {keys.length > 0 ? (
                  <ul className=" list-disc list-inside text-sm flex flex-wrap gap-2 py-2 px-1 justify-center my-2 transition-opacity opacity-0 duration-500 ease-out animate-fadeIn ">
                    {keys.map((key, idx) => (
                      <li key={idx} className="flex flex-col items-center justify-center border border-ring w-48 py-2 rounded bg-card text-card-foreground ">
                        
                        <div className="w-32 h-20">
                          <img src="src/assets/key.jpg" className="rounded-md" alt="" />
                        </div>
                          <div className="break-all my-3">{key}</div>
                          <div className="flex gap-2 " >

                            <button
                              onClick={() => handleCopyKeyContent(key)}
                              className=" text-xs border border-sky-500 hover:bg-sky-600 text-white px-2 py-1 rounded"
                              >
                              Copy <Copy size={10} className="inline-block" />
                            </button>
                            <span className="text-white border boder-red-400 hover:bg-red-500 rounded px-2 py-1 "
                              onClick={()=> handleDelete(key, idx, userId)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="12"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-trash2-icon lucide-trash-2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </span>
                          </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className=" text-gray-500 pt-16 ">No public keys.</p>
                )}
              </div>
              ) : (
                // images
              <div className="">
                <ImageGallery
                  folderName={selectedFolder}
                  userId={userId}
                />
              </div>
            )}
          </div>
        
        </div>
      </div>
    </div>
  );
}

export default Profile;
