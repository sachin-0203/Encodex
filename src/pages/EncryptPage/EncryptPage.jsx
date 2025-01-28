import React, { useState } from "react";
import { RotateCw } from "lucide-react";
import { useRef, useCallback } from "react";
import axios from "axios";

function EncryptPage() {
  const [file, setFile]= useState(null);
  const [message, setMessage]= useState("");
  const [encImage, setEncImage] = useState("");
  const [encKey, setEncKey] = useState("")

  const eImageRef = useRef(null)
  const eKeyRef = useRef(null)

  const ResetForm = () => {
    // Clear file input
    document.querySelector("input[type='file']").value = "";
    // Clear all the text-area, input field
    setEncImage("")
    setEncKey("")
  };

  const handleEncImage =()=>{
    copyEncryptionImage()
    copyButtonText('copy-image-btn')
  }

  const handleEncKey = () =>{
    copyEncryptionKey()
    copyButtonText('copy-key-btn')
  }
  const copyEncryptionImage = useCallback(()=>{
    eImageRef.current?.select()
    window.navigator.clipboard.writeText(encImage)
  }, [encImage])


  const copyEncryptionKey = useCallback(()=>{
    eKeyRef.current?.select()
    window.navigator.clipboard.writeText(encKey);
    
  }, [encKey])

  const copyButtonText = (id) =>{
    const button = document.getElementById(id)
    button.textContent = 'Copied'

    setTimeout(()=>{
      button.textContent = 'Copy'
    } , 1000)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('File Selected')
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please Select a Image.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/encrypt",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data
      if(result.status === 'success'){
        setEncImage(result.encrypted_content)
        setEncKey(result.encryption_key)
      }
      setMessage(response.data.message || "File Uploaded Successfully.");
    } 
    catch (error) {
      setMessage(
        error.response?.data?.error || "An Error While uploading the file."
        );  
    }
  };

  return (
    <div>
      <div className="inline-flex justify-between ">
        <div>Upload Your Image:</div>
        {message && <p>{message}</p> }
        <div>
          <button
            className="bg-red-500 hover:bg-red-700 rounded-sm  p-2  text-white"
            onClick={ResetForm}
          >
            <RotateCw size={15} />
          </button>
        </div>
      </div>
      <div>
        <form
          id="encrypt-form"
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
            <input
              className="w-full cursor-pointer border border-gray-500 p-2 rounded-md" 
              type="file"
              id="image-field"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              className=" text-text-light bg-accent-dark hover:bg-purple-700 border border-gray-500 rounded-sm w-full mt-2 p-2"
              type="submit"
            >
              Encrypt
            </button>
        </form>

        <div className=" border-2 border-black mt-2 p-2 text-center">
          <div className=" h-full p-2 text-center">
            <h2 className="text-xl mb-1">Encrypted Image:</h2>
            <div className="flex">
              <textarea
                id="encrypted-image"
                placeholder="Your Encypted Image"
                ref={eImageRef}
                value={encImage}
                className="
                  w-full h-20  border border-r-0 border-zinc-600 rounded-l-md p-2 text-justify resize-none"
                readOnly
              ></textarea>

              <button 
                id= "copy-image-btn"
                className="
                bg-green-600 hover:bg-green-700 rounded-sm h-20 p-2 text-white rounded-r-md border border-l-0 border-text-dark text-justify"
                onClick={handleEncImage}
              >
                Copy
              </button>
            </div>
          </div>
          <div className="px-2 text-center">
            <h2 className="text-xl mt-3 mb-2">Key:</h2>
            <div className="flex">
              <textarea
                id="encrypted-key"
                placeholder="Your Encypted Key"
                ref={eKeyRef}
                value={encKey}
                className="
                  w-full h-12 border border-r-0 border-zinc-600 overflow-auto text-wrap rounded-l-md p-2 resize-none"
                readOnly
              ></textarea>
              <button 
                id="copy-key-btn"
                className=" bg-green-600 hover:bg-green-700 rounded-sm h-12 p-2 text-white rounded-r-md border border-l-0 border-text-dark"
                onClick={handleEncKey} 
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EncryptPage;
