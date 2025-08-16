import React, {useEffect, useState} from "react";
import { useNavigate , Link, NavLink} from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import ImageGallery from "../Gallery/ImageGallery";
import MetadataActivity from "../Gallery/MetaData";
import { toast } from "sonner";
import { UserPen, Plus, Copy, Activity, PenLine } from "lucide-react";
import '../../../src/customeCss.css'
import Example from '../../AnimatedButton'


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
    <div className="Relative flex w-full flex-col sm:flex-row transition-all duration-500 p-2">

      {/* Main- Left -section */}
      <div className="basis-[25%] sm:h-[screen] min-w-[14rem] p-2 rounded-md text-center mb-5 ">

        <div className="sticky top-24 flex flex-col  gap-4 text-sm w-full ">

          <div className="basis-1/2 shadow-[0_1px_0_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.35)] rounded-md p-2 ">
            <div className="relative w-fit mx-auto my-4  ">
              <div className="absolute right-2 bottom-1 rounded-full bg-green-500 size-3" />
              <img 
                src={profileSrc} 
                alt="Profile Pic" 
                className={`size-24 rounded-full object-cover border-2 shadow-md `}
              />
            </div>
          
            <div className="text-xl" >
              {user}
            </div>
            
            <div className="text-gray-500" >
              {username}
            </div>

            <div className=" truncate" >
              {userEmail}
            </div>

            <Link to="/Setting" className="box-border border-2 border-double flex justify-center items-center gap-3 p-0.5 rounded-md hover:border transition-all hover:scale-105 hover:bg-background/20 active:scale-90  mt-3 mx-2 ">
              
              <PenLine size={15} className="stroke-1" />
              <div className="font-thin" >Edit Profile</div>
              
            </Link>
          </div> 

          <div className="basis-1/2">

            <div className="text-center rounded-lg border shadow-[0_1px_0_rgba(255,255,255,0.06),0_2px_2px_rgba(0,0,0,0.35)] transition-all duration-200 w-full py-2">

              <div 
                className="flex size-16 items-center justify-center rounded-full border border-sky-500/40 bg-sky-500/10  text-sky-400 mx-auto my-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-10 w-10">
                  <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm10 0a2 2 0 1 0 .001 3.999A2 2 0 0 0 17 18zM6.3 6l.4 2h11.4a1 1 0 0 1 .98 1.197l-1 5A2 2 0 0 1 16.12 16H9.02a2 2 0 0 1-1.96-1.598L5.1 5.2a1 1 0 0 0-.98-.8H3a1 1 0 1 1 0-2h1.12a3 3 0 0 1 2.94 2.4L7 6h-.7z"/>
                </svg>
              </div>

              <h3 className="font-semibold text-lg mb-1 ">Explore Subscription</h3>

              <p className="text-sm text-gray-400 md:px-2">
                Unlimited projects, priority support, and advanced analytics to help you grow faster.
              </p>


              <button
                type="button"
                onClick={()=>navigate('/plus')}
                className=" rounded-md py-1 text-white shadow-[0_8px_15px_rgba(31,162,255,0.35)] transition-all duration-500 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-sky-500/50 w-[95%] mt-3 bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#1FA2FF] bg-[length:200%_auto] hover:bg-[position:right_center]"

              >
                Explore
              </button>
            </div>
          </div>

        </div>
      </div>

      

      {/* Main- Right Section */}
      <div className="basis-[80%] min-h-[85vh] min-w-[14rem] ">

        {/* Upper Col */}
        <div className="flex flex-grow gap-2 md:flex-row flex-col ">

          {/* right-col-1 : Progress */}
          <div id="Overall Progress" className=" min-h-[16rem] rounded-md basis-[60%] mb-2 shadow-[inset_0_6px_12px_rgba(0,0,0,0.3)]">

            <div className="flex flex-col h-full"  >
              <header className="px-5 inline-flex items-center gap-2">
                <Activity size={24} />
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
