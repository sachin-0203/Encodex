import React, { useContext, useState, useRef } from "react";
import { RotateCw, DownloadIcon } from "lucide-react";
import axios from "axios";
import { MyContext } from "../../Context/MyContext";

function DecryptPage() {
  const { logMessage } = useContext(MyContext);
  const [decText, setDecText] = useState("");
  const [decKey, setDecKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [decryptImageUrl, setDecryptImageUrl] = useState(null);

  const ResetForm = () => {
    logMessage("✅ Form Reset Successfully");
    setDecText("");
    setDecKey("");
    setRecipient("");
    setDecryptImageUrl(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return logMessage("No file selected ❗");

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      setDecText(reader.result);
      logMessage("📂 Encrypted file loaded successfully!");
    };
  };

  const decHandleSubmit = async (e) => {
    e.preventDefault();

    if (!decText || !decKey || !recipient) {
      logMessage("The Encrypted text, Key, or Recipient is missing ❗");
      return;
    }

    const filename = "decrypt_Image.png";
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/decrypt",
        JSON.stringify({ encrypted_image: decText, encryption_key: decKey, recipient, filename }),
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.decrypted_image) {
        logMessage("Image Decrypted Successfully ✅");
        const base64Image = response.data.decrypted_image;

        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/png" });

        const imageUrl = URL.createObjectURL(blob);
        setDecryptImageUrl(imageUrl);
      } else {
        logMessage("❌ Failed to Decrypt the image");
      }
    } catch (error) {
      logMessage("Error while Decrypting the image❗");
    }
  };

  return (
    <>
      <div className="border-2 text-center p-4">
        <div className="flex justify-between mb-2">
          <button
            onClick={ResetForm}
            className="text-white bg-red-500 hover:bg-red-700 border border-gray-500 rounded-sm p-2"
          >
            <RotateCw size={15} />
          </button>
          {decryptImageUrl && (
            <a href={decryptImageUrl} download={`${"decryptImage"}.png`}>
              <button className="bg-green-500 hover:bg-green-700 p-2 rounded-sm text-white">
                <DownloadIcon size={20} />
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
              className="w-full border border-gray-500 p-2 rounded-md"
              onChange={handleFileUpload}
            />
          </div>
          <div className="mb-3">
            <h2 className="text-xl mb-1">Recipient:</h2>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full border border-gray-500 p-2 rounded-md"
              type="text"
              placeholder="Enter Recipient (Email/Username)"
            />
          </div>
          <div className="mb-3">
            <h2 className="text-xl mb-1">Decryption Key:</h2>
            <textarea
              value={decKey}
              onChange={(e) => setDecKey(e.target.value)}
              placeholder="Decryption Key here"
              className="w-full h-16 border border-zinc-600 resize-none rounded-md p-2"
            ></textarea>
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 border border-gray-500 rounded-sm w-full p-2">
            Decrypt
          </button>
        </form>
      </div>
    </>
  );
}

export default DecryptPage;
