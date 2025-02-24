import React, {useContext, useRef, useState} from "react";
import { RotateCw, DownloadIcon } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";

function DecryptPage() {

  const { logMessage } = useContext(MyContext);
  const [decText, setDecText] = useState("");
  const [decKey, setDecKey] = useState("");
  const [customname, setCustomname] = useState("");
  const [decryptImageUrl, setDecryptImageUrl] = useState(null)
  
  
  const ResetForm = ()=>{
    logMessage('✅ Form Reset Successfully');
    setDecText("")
    setDecKey("")
    setCustomname("")
    setDecryptImageUrl(null)
  }
  
  const decHandleSubmit =  async (e) =>{
    e.preventDefault();
    if(!decText || !decKey){
      logMessage('The Encrypted text or The Key is missing ❗')
      return;
    }
    const filename = customname || "decryptImage.png"
    try{
      const response = await axios.post('http://127.0.0.1:5000/decrypt' ,{ encrypted_image: decText, key: decKey, filename: filename},
        {headers:{"Content-Type": "application/json"}}
      );
      // setMessage('')
      logMessage('Image Decrypt Successfully ✅')
      if(response.data){
        const base64Image = response.data.decrypted_image;

        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for(let i=0; i<byteCharacters.length; i++){
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray],{type: 'image/png'});
        
        const imageUrl = URL.createObjectURL(blob);
        setDecryptImageUrl(imageUrl);
      }
      else{
        logMessage('❌ Failed to Decrypt the image ')
      }
    }
    catch(error){
      logMessage('Error while Decrypting the image❗')
    };
    
    
  }
  return (
    
    <>
      <div className=" border-2 text-center">
        <div>
        <button
            // type="reset"
            onClick={ResetForm} 
            className=" flex-1 text-white bg-red-500 hover:bg-red-700 border border-gray-500 rounded-sm w p-2 mt-2 mr-2 ">
              <RotateCw size={15} />
            </button>
          <span>{decryptImageUrl && (
            <a href={decryptImageUrl} download={`${customname || "decryptImage"}.png`}>
              <button><DownloadIcon size={20}/></button>
            </a>
          )}
          </span>
        </div>
        <form 
          id="decrypt-form"
          method="post"
          onSubmit={decHandleSubmit}
          encType="mulipart/form-data"
        >
          <div className=" h-full p-2 text-center my-1">
            <h2 className="text-xl mb-1">Encrypted Image:</h2>
            <div>
              <textarea
                id="decrypt-image"
                value={decText}
                onChange={(e)=>setDecText(e.target.value)}
                placeholder="Place the encrypted image here"
                className="w-full h-20  border border-zinc-600 resize-none rounded-md p-2 text-justify"
              ></textarea>
            </div>
            <div >
              <input
               value={customname}
               onChange={(e)=>setCustomname(e.target.value)}
                className="border border-accent-light" 
              type="text" placeholder="Type custome filename"/>
            </div>
          </div>
          <div className="px-2 text-center">
            <h2 className="text-xl my-3">Decryption Key:</h2>
            <div>
              <textarea
                id="decrypt-key"
                value={decKey}
                onChange={(e)=>setDecKey(e.target.value)}
                placeholder="Decrypted Key here"
                className="w-full h-16 border border-zinc-600 overflow-auto text-wrap resize-none rounded-md p-2"
              ></textarea>
            </div>
          </div>
          <div className="flex gap-2 text-white ">
            <button
              type="submit"
              className=" bg-blue-500 hover:bg-blue-700 border border-gray-500 rounded-sm w-full p-2 mt-2 ml-2 "
            >
              Decrypt
            </button>
          </div>
        </form>
        
      </div>
    </>
  );
}

export default DecryptPage;
