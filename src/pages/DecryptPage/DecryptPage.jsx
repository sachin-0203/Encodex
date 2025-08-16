import React, { useContext, useState, useRef } from "react";
import { RotateCw, DownloadIcon, Loader2, ShieldCheck, CloudUpload, Image } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";
import "../../App.css"
import { useAuth } from "@/Context/AuthContext";

function DecryptPage() {
  const { logMessage, logHistory } = useContext(MyContext);
  const {accessToken} = useAuth();
  const [file, setFile] = useState("");
  const [decText, setDecText] = useState("");
  const [decKey, setDecKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [decryptImageUrl, setDecryptImageUrl] = useState(null);
  const [imagename, setImagename] = useState("")
  const [loading, setLoading] = useState(false);

  const btnRef = useRef(null);
  const resetIconRef = useRef(null);

  const ResetForm = () => {
    document.querySelector("input[type='file']").value = "";
    setFile("");
    setDecText("");
    setDecKey("");
    setRecipient("");
    setDecryptImageUrl(null);
    resetAnimation();
    logMessage("✅ Form Reset Successfully");
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

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    else return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return logMessage("No file selected ❗");
    setFile(file)
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setDecText(reader.result);
      logMessage("📂 Encrypted file loaded successfully!");
    };
    const nameWithoutExtension = file.name.replace(/\.enc$/, '');
    const name = `${nameWithoutExtension}_dec.png`;
    setImagename(name);
  };

  const downloadAnimation= ()=>{
    if(!decryptImageUrl) return;
    const btn = btnRef.current;
    if (btn) {
      btn.classList.add("bounce-arrow");

      setTimeout(() => {
        btn.classList.remove("bounce-arrow");
      }, 400); 
    }
}
  const decHandleSubmit = async (e) => {
    e.preventDefault();
    if (!decText || !decKey || !recipient) {
      logMessage("The Encrypted text, Key, or Recipient is missing ❗");
      return;
    }
    setLoading(true);
    const filename = imagename;
    try {

      await new Promise((res) => setTimeout(res, 2000));
      const response = await axios.post(
        "http://127.0.0.1:5000/decrypt",
        JSON.stringify({ encrypted_image: decText, encryption_key: decKey,recipient, filename }),
        { headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json" 
        }}
      );

      if (response.data.decrypted_image) {

         setLoading(false);
        const base64Image = response.data.decrypted_image;
        const filename = response.data.filename

        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        const imageUrl = URL.createObjectURL(blob);
        setDecryptImageUrl(imageUrl);
        logMessage("Image Decrypted Successfully ✅");
        logHistory(`File: ${filename}`);
      } else {
        logMessage("❌ Failed to Decrypt the image");
      }
    } catch (error) {
      logMessage("Error while Decrypting the image❗");
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <>
      <div> 

        <div className="flex justify-between items-center">
          <h2>Upload Image:</h2>
          <button
            onClick={ResetForm}
            className="text-white bg-destructive hover:bg-destructive/50 rounded-sm p-2"
          >
            <svg 
              ref={resetIconRef}
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-rotate-cw-icon lucide-rotate-cw"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
            </svg>
          </button>
          
         
        </div>

        <form id="decrypt-form" method="post" onSubmit={decHandleSubmit}>
          <div className="mb-2">
            
            <label className={`flex flex-col items-center justify-center w-full  h-28 border-2 border-dotted border-gray-500 ${file? "border-sky-300":""} rounded-md cursor-pointer hover:border-primary transition-colors mt-2 group`}>
              {!file? (
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <CloudUpload size={25} className="stroke-1 group-hover:text-muted-foreground" />
                    <p className="text-sm group-hover:text-muted-foreground " > Click to upload .enc file</p>
                  </div>
                ):(
                <div className="flex flex-col items-center justify-center space-y-1 px-2 text-sky-900">
                  <p> <Image size={20} className="stroke-1 "/> </p>
                  <p className="text-sm font-medium text-primary truncate max-w-full">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              )}
              
              <input className="hidden"  type="file" accept=".enc" onChange={handleFileUpload} />
            </label>


          </div>
          <div className="mb-3">
            <h2 className=" mb-1">Recipient:</h2>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full p-2 rounded-md outline-none border bg-background text-foreground ${recipient? "border-sky-300 text-sky-600 " : ""} `}
              type="text"
              placeholder="Enter Recipient (Username)"
            />
          </div>
          <div className="mb-3">
            <h2 className=" mb-1">Decryption Key:</h2>
            <textarea
              value={decKey}
              onChange={(e) => setDecKey(e.target.value)}
              placeholder="Decryption Key here"
              className={`w-full h-10 border border-gray-500 resize-none rounded-md p-2 outline-none text-sm bg-background ${decKey? "text-sky-600 border-sky-300" : ""} scrollbar-none `}
            ></textarea>
          </div>
          <button
            className=" inline-flex justify-center gap-2 items-center text-white bg-primary hover:bg-primary/60 rounded-sm w-full p-2 disabled:opacity-60 disabled:cursor-not-allowed "
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20}/> 
                <span className="mr-2 ">Decrypting...</span>
              </>
            ):(
              <>
                <ShieldCheck size={18} />
                <span className="mr-2">Decrypt</span>
              </>
            )}
          </button>
        </form>

        <div className={` ${(!loading && decryptImageUrl)? "":"hidden"}  border border-secondary rounded-md my-2 p-2 space-y-2 bg-[rgba(120,238,144,0.15)] text-sm md:text-lg`} >

          <div className="flex gap-2 text-secondary items-center"> 
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-check-big-icon lucide-circle-check-big">
              <path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <path d="m9 11 3 3L22 4" />
            </svg>

            <div className="font-bold">
              Decryption Complete!
            </div>
          </div>
          <div className="flex flex-wrap w-full items-center">

            <div className="text-[11px] md:text-sm  overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0 pl-2 text-secondary ">
              {imagename}
            </div>

            <a href={decryptImageUrl} download={imagename}>
              <button ref={btnRef} className="ml-1 text-right  rounded-sm p-2 text-green-600 $ hover:bg-green-600 hover:text-white"
                onClick={downloadAnimation} >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="15" 
                  height="15" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="download-icon"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline className="arrow" points="7 10 12 15 17 10"/>
                  <line className="arrow" x1="12" x2="12" y1="15" y2="3"/>
                </svg>
              </button>
            </a>
          </div>
          
        </div>
        
      </div>
    </>
  );
}

export default DecryptPage;
