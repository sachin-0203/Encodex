import React, { useState } from "react";
import { RotateCw } from "lucide-react";


function EncryptPage() {
  const [file, setFile]= useState(null);
  const [message, setMessage]= useState("");
  
  const ResetForm = () => {
    // Clear file input
    document.querySelector("input[type='file']").value = "";
    // Clear all the text-area, input field
    document.querySelector("#encrypted-image").value = "";
    document.querySelector("#encrypted-key").value = "";
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please Select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload_image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message || "File Uploaded Successfully.");
      console.log("Try executed")
    } catch (error) {
      setMessage(
        error.response?.data?.error || "An Error While uploading the file."
      );
      console.log('Catch executed');
    }
  };
  return (
    <div>
      <div className="inline-flex justify-between ">
        <div>Upload Your Image:</div>
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
          action="/upload"
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
            <input
              className="w-full cursor-pointer border border-gray-500 p-2 rounded-md" required
              type="file"
              id="image"
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
                className="
                  w-full h-20  border border-r-0 border-zinc-600 rounded-l-md p-2 text-justify resize-none"
                value={
                  ""
                }
                readOnly
              ></textarea>
              <button className=" bg-green-600 hover:bg-green-700 rounded-sm h-20 p-2 text-white rounded-r-md border border-l-0 border-text-dark text-justify">
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
                className="
                  w-full h-12 border border-r-0 border-zinc-600 overflow-auto text-wrap rounded-l-md p-2 resize-none"
                value={
                  ""
                }
                readOnly
              ></textarea>
              <button className=" bg-green-600 hover:bg-green-700 rounded-sm h-12 p-2 text-white rounded-r-md border border-l-0 border-text-dark">
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
