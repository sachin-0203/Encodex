import React, { useContext, useState, useRef, useCallback } from "react";
import { RotateCw } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";
import "../../App.css";



function EncryptPage() {
  const context = useContext(MyContext);
  const { logMessage, logHistory } = context;

  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [encImage, setEncImage] = useState("");
  const [encKey, setEncKey] = useState("");
  const [imagename , setImagename] = useState("");
  const [copied, setCopied] = useState(false);
  

  const btnRef = useRef(null);
  const eImageRef = useRef(null);
  const eKeyRef = useRef(null);
  const resetIconRef = useRef(null);

  const ResetForm = () => {
    document.querySelector("input[type='file']").value = "";
    setFile(null);
    setRecipient("");
    setEncImage("");
    setEncKey("");
    logMessage("✅ Form Reset Successfully");
    resetAnimation();
  };
  const resetAnimation=()=>{
    const resetIcon = resetIconRef.current;
    if(resetIcon){
      resetIcon.classList.add("rotate");

      setTimeout(() => {
        resetIcon.classList.remove("rotate");
      }, 800);
    }
  }

  const handleEncImage = () => {
    handleDownload();
    downloadButtonAnimation('copy-image-btn');
  };

  const handleEncKey = () => {
    copyEncryptionKey();
    copyButtonIconAnimation();
  };

  const copyEncryptionKey = useCallback(() => {
    if (!encKey) return logMessage("Key Field is Empty ❗");
    eKeyRef.current?.select();
    window.navigator.clipboard.writeText(encKey);
  }, [encKey]);

  const copyButtonIconAnimation = () =>{
    if(!encKey) return;

    setCopied(true)

    setTimeout(()=>{
      setCopied(false)
    } , 1000)
  }
  const downloadButtonAnimation = () =>{
    if(!encImage) return;
    const btn = btnRef.current;
    if (btn) {
      btn.classList.add("bounce-arrow");

      setTimeout(() => {
        btn.classList.remove("bounce-arrow");
      }, 400); 
    }
  }

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      logMessage("Image is Uploaded ✔️");
      logHistory(`${uploadedFile.name}`);
    } else {
      logMessage("No Image Uploaded❓");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return logMessage("Please! Select an Image ❗");
    if (!recipient) return logMessage("Please! Enter a Recipient ❗");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("recipient", recipient);

    try {
      const response = await axios.post("http://127.0.0.1:5000/encrypt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const result = response.data;
      
      if (result.status === "success") {
        setEncImage(result.encrypted_content);
        setEncKey(result.encrypted_aes_key);
        setImagename(result.image_name);
        logMessage(`${result.message}✅`);
      } else {
        logMessage(`❌ ${result.message}`);
      }
    } 
    catch (error) {
      logMessage("Error during Encryption❓");
    }
  };
  const handleDownload = () => {
    if (!encImage) return logMessage("No Encrypted Data❗");
  
    const blob = new Blob([encImage], { type: "text/plain" }); // Create a text file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = imagename; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logMessage("📥 File Downloaded Successfully!");
  };

  return (
    <div>
      <div className="flex justify-between">

        <div>Upload Your Image:</div>

        <button  className="bg-destructive hover:bg-destructive/50 rounded-sm p-2 text-destructive-foreground" onClick={ResetForm}>

          <svg ref={resetIconRef} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>

        </button>

      </div>
      <form id="encrypt-form" method="post" onSubmit={handleSubmit} encType="multipart/form-data">

        <input className="w-full cursor-pointer border border-ring p-1 rounded-md" type="file" accept="image/*" onChange={handleFileChange} />

        <div className="relative">
          <input
            id="recipient"
            className="peer w-full border border-ring/50 p-2 rounded-md  my-2 outline-none focus:border-border bg-background"
            type="text"
            placeholder=" "
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <label htmlFor="recipient" 
            className={`absolute left-2 px-1 top-5 text-gray-500 bg-background text-sm transition-all  peer-focus:top-0.5 peer-focus:text-sm peer-focus:text-ring ${recipient? 'top-[2px]':''} `}
          >
            Enter Recipient (Email/Username)
          </label>
        </div>

        <button className="text-white bg-primary hover:bg-primary/60 border rounded-sm w-full p-2 " type="submit">
          Encrypt
        </button>

      </form>
      <div className="border border-gray-300 rounded-md my-2 p-2 text-center">
        <h2 className="text-xl mb-1">Encrypted Image:</h2>
        <div className="flex relative">
          <textarea id="encrypted-image" placeholder="Your Encrypted Image" ref={eImageRef} value={encImage} className="w-full h-20 bg-background text-foreground border rounded-md p-2 pr-12 resize-none outline-none scrollbar-none " readOnly></textarea>

          <button id="copy-image-btn" ref={btnRef} className={`absolute  top-1 right-1   rounded-sm h-[72px] p-2 text-white ${encImage? 'bg-green-600 hover:bg-green-700':'bg-green-700/20'} `} onClick={handleEncImage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="download-icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline className="arrow" points="7 10 12 15 17 10"/>
              <line className="arrow" x1="12" x2="12" y1="15" y2="3"/>
              </svg>
          </button>
          
        </div>
        
        <h2 className="text-xl mt-2 mb-1">Key:</h2>
        <div className="flex relative">
          <textarea id="encrypted-key" placeholder="Your Encrypted Key" ref={eKeyRef} value={encKey} className="w-full h-16 border rounded-md p-2 pr-12 resize-none bg-background text-foreground outline-none scrollbar-none" readOnly></textarea>

          <button id="copy-key-btn" className={`absolute top-1 right-1 rounded-sm h-[57px] p-2 text-white ${encKey? 'bg-green-600 hover:bg-green-700':'bg-green-700/20'} `} onClick={handleEncKey}>
            {copied? (
              <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
              ):(
              <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EncryptPage;
