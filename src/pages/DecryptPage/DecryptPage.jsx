import React, { useContext, useState, useRef } from "react";
import { RotateCw, DownloadIcon } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";
import "../../App.css"
import { useAuth } from "@/Context/AuthContext";

function DecryptPage() {
  const { logMessage, logHistory } = useContext(MyContext);
  const {accessToken} = useAuth();
  const [decText, setDecText] = useState("");
  const [decKey, setDecKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [decryptImageUrl, setDecryptImageUrl] = useState(null);
  const [imagename, setImagename] = useState("")

  const btnRef = useRef(null);
  const resetIconRef = useRef(null);

  const ResetForm = () => {
    document.querySelector("input[type='file']").value = "";
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return logMessage("No file selected ❗");
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
    const filename = imagename;
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/decrypt",
        JSON.stringify({ encrypted_image: decText, encryption_key: decKey,recipient, filename }),
        { headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json" 
        }}
      );

      if (response.data.decrypted_image) {
        
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
  };

  return (
    <>
      <div className="text-center p-4">
        <div className="flex justify-between mb-2">
          <button
            onClick={ResetForm}
            className="text-white bg-destructive hover:bg-destructive/50 rounded-sm p-2"
          >
            <svg ref={resetIconRef} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
          {decryptImageUrl && (
            <a href={decryptImageUrl} download={imagename}>
              <button ref={btnRef} className="bg-green-500 hover:bg-green-700 p-2 rounded-sm text-white" onClick={downloadAnimation} >
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24"    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="download-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline class="arrow"  points="7 10 12 15 17 10"/>
                <line class="arrow"  x1="12" x2="12" y1="15" y2="3"/>
                </svg>
              </button>
            </a>
          )}
        </div>
        <form id="decrypt-form" method="post" onSubmit={decHandleSubmit}>
          <div className="mb-3">
            <h2 className="text-xl mb-1">Upload Encrypted Image:</h2>
            <input
              type="file"
              accept=".enc"
              className={`w-full border border-ring p-2 rounded-md ${imagename? 'border-input':''} `}
              onChange={handleFileUpload}
            />
          </div>
          <div className="mb-3">
            <h2 className="text-xl mb-1">Recipient:</h2>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className={`w-full p-2 rounded-md outline-none border bg-background text-foreground `}
              type="text"
              placeholder="Enter Recipient (Username)"
            />
          </div>
          <div className="mb-3">
            <h2 className="text-xl mb-1">Decryption Key:</h2>
            <textarea
              value={decKey}
              onChange={(e) => setDecKey(e.target.value)}
              placeholder="Decryption Key here"
              className="w-full h-16 border resize-none rounded-md p-2 outline-none text-foreground bg-background"
            ></textarea>
          </div>
          <button type="submit" className="bg-primary hover:bg-primary/60 border rounded-sm w-full p-2 text-white">
            Decrypt
          </button>
        </form>
      </div>
    </>
  );
}

export default DecryptPage;
