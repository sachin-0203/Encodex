import React, { useContext, useState, useRef, useCallback } from "react";
import { CloudUpload, Image, ShieldCheck, Loader2, CircleCheckBig } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";
import "../../App.css";
import { useAuth } from "@/Context/AuthContext";



function EncryptPage() {
  const context = useContext(MyContext);
  const { logMessage, logHistory } = context;
  const {accessToken} = useAuth()

  const [file, setFile] = useState(null);
  const [recipient, setRecipient] = useState("");
  const [errors, setErrors] = useState({});
  const [encImage, setEncImage] = useState("");
  const [encKey, setEncKey] = useState("");
  const [imagename , setImagename] = useState("");
  const [keyname , setKeyname] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  

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
    setErrors({})
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

  
  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    else if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    else return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileChange = async (e) => {

    const file = e.target.files[0];
    if (!file){
      logMessage('Upload a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setErrors({})

    try {
      const res = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const result =  res.data;
      if (result.status === 'success') {
        logMessage('File Upload')
        setFile(file)
        logHistory(`File uploaded: ${result.filename}`);

      } else {
        logMessage('Upload failed');
      }
    } catch (err) {
      logMessage('Error uploading file');
    }
  };
  const handleTextChange = (setter, field) => (e) => {
    const value = e.target.value;
    setter(value);

    if (value.trim()) {
      setErrors((prev) => {
        const { [field]: removed, ...rest } = prev;
        return rest; 
      });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let newErrors = {};
    if (!file || !recipient){
      logMessage("Please! Select an Image or Recipient❗");
      if(!file) newErrors.image = "Image is required";
      if(!recipient) newErrors.recipient = "Recipient is required";
      setErrors(newErrors);
      setLoading(false);
      return
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("recipient", recipient);

    try {

      setErrors({})
      await  new Promise((res) => setTimeout(res, 2000));
      const response = await axios.post("http://127.0.0.1:5000/encrypt", formData, {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        },
      });

      const result = response.data;
      setLoading(false);
      
      if (result.status === "success") {
        setEncImage(result.encrypted_content);
        setEncKey(result.encrypted_aes_key);
        setImagename(result.image_name);
        setKeyname(result.key_name);
        logMessage(`${result.message}✅`);
        logHistory(`key: ${result.key_name}`)
        logHistory(`File:  ${result.image_name}`)
      } else {
        logMessage(`❌ ${result.message}`);
      }
    } 
    catch (error) {
      logMessage("Error during Encryption❓");
    }
    finally{
      setLoading(false);
    }
  };
  const handleDownload = () => {
    if (!encImage) return logMessage("No Encrypted Data❗");
  
    const blob = new Blob([encImage], { type: "text/plain" }); 
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

      <div className="flex justify-between items-center textSize ">

        <div>Upload Image:</div>

        <button  className="bg-destructive hover:bg-destructive/50 rounded-full p-1 sm:p-2 text-destructive-foreground " onClick={ResetForm}>

          <svg ref={resetIconRef} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw-icon lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>

        </button>

      </div>

      <form className="flex flex-col gap-4 " id="encrypt-form" method="post" onSubmit={handleSubmit} encType="multipart/form-data">

        <div>
          <label className={`flex flex-col items-center justify-center w-full h-52 border-2 border-dotted rounded-md cursor-pointer hover:border-primary transition-colors mt-2 group ${errors.image? "border-destructive" : ""} `}>
            {!file? 
            (  
              <div className="flex flex-col items-center justify-center space-y-2">
                <CloudUpload size={25} className="stroke-1" />
                <p className="textSize">
                  Upload your image
                </p>
              </div>

            ):(
                <div className="flex flex-col items-center justify-center space-y-1 sm:px-2">
                  <p> <Image size={20} className="stroke-1 text-muted-foreground"/> </p>
                    <p className="text-sm text-primary ">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>

            )}
            
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
        </div>
        


        <div className="relative">
          <input
            id="recipient"
            className={`peer w-full border ${errors.recipient? "border-destructive" : ""} ${recipient? 'text-sky-600 border-sky-300':''}  p-2 rounded-md my-2 outline-none bg-transparent `}
            type="text"
            placeholder=""
            value={recipient}
            onChange={handleTextChange(setRecipient, "recipient")}
          />
          <label htmlFor="recipient" 
            className={`absolute left-2 px-1 top-5 text-gray-500 text-sm transition-all  peer-focus:top-[-12px] peer-focus:left-0 peer-focus:text-ring ${recipient? 'top-[-12px] left-[0] ':''} `}
          >
            Enter Recipient
          </label>
          {errors.recipient && <p className="text-red-500 text-xs">{errors.recipient}</p>}
        </div>

        <button
          className=" inline-flex justify-center gap-2 items-center text-white bg-primary hover:bg-primary/60 rounded-sm w-full p-2 disabled:opacity-60 disabled:cursor-not-allowed "
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20}/> 
              <span className="mr-2 ">Encrypting...</span>
            </>
          ):(
            <>
              <ShieldCheck size={18} />
              <span className="mr-2">Encrypt</span>
            </>
          )}
        </button>

      </form>

      {/* Encryption Output */}
      <div className={` ${(encImage && !loading )? "" : 'hidden'}  border border-secondary rounded-md my-2 p-2  bg-[rgba(120,238,144,0.15)] text-sm md:text-lg mb-5`}>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 text-secondary items-center">

            <CircleCheckBig size={20} />
            <div className="font-bold">
              Encryption Complete!
            </div>
          </div>     

          <div className="flex justify-center gap-2 text-gray-600 items-center text-sm">
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-cloud-check-icon lucide-cloud-check h-4">
              <path d="m17 15-5.5 5.5L9 18"/>
              <path d="M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742"/>
            </svg>  
            <h2>Saved</h2>        
          </div>

        </div>



        <div className="md:ml-6 mt-3  mr-2">
          <div className="flex flex-wrap w-full items-center justify-between">

              <h2 className="text-md text-secondary ">
                Encrypted Image:
              </h2>

              <div 
                className=" flex  w-full sm:w-[50%] items-center text-left sm:text-right " 
              >
                <div className="text-[11px] md:text-sm  overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0 pl-2 ">
                  {imagename || "No image"}
                </div>
                <button id="copy-image-btn" ref={btnRef} className="ml-1 text-right  rounded-sm p-1 text-green-600 $ hover:bg-green-600 hover:text-white" onClick={handleEncImage}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="download-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline className="arrow" points="7 10 12 15 17 10"/>
                    <line className="arrow" x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                </button>
              </div>
          </div>
        </div>

        <div className="md:ml-6 mr-2 border-t border-gray-400">
          <div className="flex justify-between flex-wrap items-center">
            <h2 className="text-md mt-2 mb-1 text-secondary ">Decryption Key:</h2>
            <div className="flex gap-1 items-center  text-[11px] md:text-sm pl-2">
              <div>
                {keyname || "No key"}
              </div>

              <button id="copy-key-btn" className={`rounded-sm h-[28px] p-1 text-green-600 hover:bg-green-600 hover:text-white`} onClick={handleEncKey}>
                {copied? (
                  <svg  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                  ):(
                  <svg  xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-icon lucide-copy">
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default EncryptPage;
