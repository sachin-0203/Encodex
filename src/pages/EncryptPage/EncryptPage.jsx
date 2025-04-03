import React, { useContext, useState, useRef, useCallback } from "react";
import { RotateCw } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";

function EncryptPage() {
  const context = useContext(MyContext);
  const { logMessage, logHistory } = context;

  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [encImage, setEncImage] = useState("");
  const [encKey, setEncKey] = useState("");

  const eImageRef = useRef(null);
  const eKeyRef = useRef(null);

  const ResetForm = () => {
    document.querySelector("input[type='file']").value = "";
    setFile(null);
    setRecipient("");
    setEncImage("");
    setEncKey("");
    logMessage("✅ Form Reset Successfully");
  };

  const handleEncImage = () => {
    handleDownload();
    downloadButtonText('copy-image-btn');
  };

  const handleEncKey = () => {
    copyEncryptionKey();
    copyButtonText('copy-key-btn');
  };

  // const copyEncryptionImage = useCallback(() => {
  //   if (!encImage) return logMessage("Image Field is Empty❗");
  //   eImageRef.current?.select();
  //   window.navigator.clipboard.writeText(encImage);
  // }, [encImage]);

  const copyEncryptionKey = useCallback(() => {
    if (!encKey) return logMessage("Key Field is Empty ❗");
    eKeyRef.current?.select();
    window.navigator.clipboard.writeText(encKey);
  }, [encKey]);

  const copyButtonText = (id) =>{
    const button = document.getElementById(id)
    if(!encImage && !encKey) return 
    button.textContent = 'Copied'

    setTimeout(()=>{
      button.textContent = 'Copy'
    } , 1000)
  }
  const downloadButtonText = (id) =>{
    const button = document.getElementById(id)
    if(!encImage && !encKey) return 
    button.textContent = 'Downloaded'

    setTimeout(()=>{
      button.textContent = 'Download'
    } , 1000)
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
        logMessage(`${result.message}✅`);
      } else {
        logMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      logMessage("Error during Encryption❓");
    }
  };
  const handleDownload = () => {
    if (!encImage) return logMessage("No Encrypted Data❗");
  
    const blob = new Blob([encImage], { type: "text/plain" }); // Create a text file
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "encrypted_image.enc"; // File name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    logMessage("📥 File Downloaded Successfully!");
  };

  return (
    <div>
      <div className="inline-flex justify-between">
        <div>Upload Your Image:</div>
        <button className="bg-red-500 hover:bg-red-700 rounded-sm p-2 text-white" onClick={ResetForm}>
          <RotateCw size={15} />
        </button>
      </div>
      <form id="encrypt-form" method="post" onSubmit={handleSubmit} encType="multipart/form-data">
        <input className="w-full cursor-pointer border border-gray-500 p-2 rounded-md" type="file" accept="image/*" onChange={handleFileChange} />
        <input
          className="w-full border border-gray-500 p-2 rounded-md mt-2"
          type="text"
          placeholder="Enter Recipient (Email/Username)"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button className="text-text-light bg-accent-dark hover:bg-purple-700 border border-gray-500 rounded-sm w-full mt-2 p-2" type="submit">
          Encrypt
        </button>
      </form>
      <div className="border-2 border-gray-300 mt-2 p-2 text-center">
        <h2 className="text-xl mb-1">Encrypted Image:</h2>
        <div className="flex">
          <textarea id="encrypted-image" placeholder="Your Encrypted Image" ref={eImageRef} value={encImage} className="w-full h-20 border border-r-0 border-zinc-600 rounded-l-md p-2 resize-none dark:bg-slate-600 dark:text-text-light" readOnly></textarea>
          <button id="copy-image-btn" className="bg-green-600 hover:bg-green-700 rounded-sm h-20 p-2 text-white rounded-r-md" onClick={handleEncImage}>
            Download
          </button>
        </div>
        
        <h2 className="text-xl mt-3 mb-2">Key:</h2>
        <div className="flex">
          <textarea id="encrypted-key" placeholder="Your Encrypted Key" ref={eKeyRef} value={encKey} className="w-full h-12 border border-r-0 border-zinc-600 rounded-l-md p-2 resize-none dark:bg-slate-600 dark:text-text-light" readOnly></textarea>
          <button id="copy-key-btn" className="bg-green-600 hover:bg-green-700 rounded-sm h-12 p-2 text-white rounded-r-md" onClick={handleEncKey}>
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default EncryptPage;
