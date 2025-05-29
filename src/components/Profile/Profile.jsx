import React, {useEffect, useState} from "react";
import { useAuth } from "@/Context/AuthContext";
import axios from "axios";
import ImageGallery from "../Gallery/ImageGallery";
import MetadataActivity from "../Gallery/MetaData";
import {  FileKey2 } from "lucide-react";

function Profile() {
  const {user, userEmail, userId, accessToken} = useAuth();

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

  const [images, setImages] = useState([]);
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
      alert(`Key content copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy key:", err);
      alert("Failed to copy key content.");
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
      <div className="border sm:h-[screen] min-w-[14rem] p-2 rounded-md ">
        {/* Left section: image */}
       <div className="sticky top-0 flex flex-row sm:flex-col gap-2 ">
        
        <div className=" basis-1/3 sm:w-100% w-50%  ">
          <div className="border mt-2.5 sm:mt-0"> 
            <div className="text-center">Profile</div>
          </div>
          <div>
            <img src="src/assets/male1.jpg" alt="Profile_Pic" className="p-4 mx-auto   min-h-20 min-w-20 object-cover rounded-full" />
          </div>
        </div>
        {/* right section: user-info */}
        <div className="basis-2/3 sm:w-full min-w-28">
          <div className="border my-2 h-12 flex items-center overflow-hidden text-ellipsis whitespace-nowrap p-2">
            {user}
            </div>
          
          <div className="border my-2 h-12 flex items-center p-2">
            @Corpse
          </div>

          <div className="border my-2 py-2 break-words overflow-hidden text-sm ">
            {userEmail}
          </div>
          
        </div>

       </div>
      </div>

      {/* Main- Right Section */}
      <div className="basis-4/5 min-h-[85vh] min-w-[14rem] ">

        {/* Upper Col */}
        <div className="flex flex-grow gap-2 md:flex-row flex-col ">

          {/* right-col-1 */}
          <div className=" min-h-[16rem] border rounded-md basis-1/2 mb-4">
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
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
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
                    <div className="w-full h-1 bg-signup rounded-full overflow-hidden mt-1">
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
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{width: `${decPercent}%`}}></div>
                    </div>
                  </div>
                  <div className="flex justify-end items-center">{decImg}/{totalImage} </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          {/* right-col-2 */}
           <MetadataActivity userId = {userId} accessToken={accessToken} />
        </div>

        {/* Lower Col */}
        <div className="border my-2 rounded-t-lg">
          <header 
            className="flex justify-evenly w-full min-w-fit min-h-[2rem] border-b rounded-t-lg px-2 py-2 sm:px-5"
          >
            <div className="flex w-full min-w-fit gap-1 sm:gap-2">
              
              <button 
                onClick={()=>handleButtonClick('uploads')}
                className={`text-sm sm:text-base px-1 py-1 sm:px-2 whitespace-nowrap flex-1 relative outline-none ${activeButton === 'uploads'? 'text-primary':''} `}
              >
                <span >
                  {islargeScreen? "Uploaded Images":"Upl Imgs"}
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
                  {islargeScreen? "Encrypted Images":"Enc Imgs"}
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
                  {islargeScreen? "Decrypted Images":"Dec Imgs"}
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

          <div>
            
            <h2 className="text-center">
              Image of user:{userId} from: {selectedFolder || "None Selected"}
            </h2>
            { activeButton === 'keys'? (
              <div className="  text-center">
                {keys.length > 0 ? (
                  <ul className=" list-disc list-inside text-sm flex gap-2 py-2 px-1 justify-center ">
                    {keys.map((key, idx) => (
                      <li key={idx} className="flex flex-col items-center justify-center border w-44 py-2 rounded ">
                        
                        <div className="w-40 h-32 flex items-center justify-center bg-gray-100 text-gray-600 rounded border mx-auto ">
                          <FileKey2 className="w-10 h-10 " />
                          <span>Key</span>
                        </div>
                          <div className="break-all">{key}</div>
                          <button
                            onClick={() => handleCopyKeyContent(key)}
                            className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                          >
                            Copy Key
                          </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className=" text-gray-500">No public keys found.</p>
                )}
              </div>
              ) : (
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
