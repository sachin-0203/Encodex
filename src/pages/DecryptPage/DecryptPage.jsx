import React from "react";
import { RotateCw } from "lucide-react";

function DecryptPage() {
  const decImageText = document.getElementById('decrypt-image')
  const decKeyText = document.getElementById('decrypt-key')
  console.log(decImageText)
  console.log(decKeyText)

  const decHandleSubmit = () =>{
    console.log("Started the Decryption")
  }
  return (

    <>
      <div className=" border-2 border-black mt-2 p-2 text-center">
        <form 
          id="decrypt-form"
          method="post"
          onSubmit={decHandleSubmit}
          encType="mulipart/form-data"
        >
          <div className=" h-full p-2 text-center my-3">
            <h2 className="text-xl mb-1">Encrypted Image:</h2>
            <div>
              <textarea
                id="decrypt-image"
                placeholder="Place the encrypted image here"
                className="w-full h-20  border border-zinc-600 resize-none rounded-md p-2 text-justify"
              ></textarea>
            </div>
          </div>
          <div className="px-2 text-center">
            <h2 className="text-xl my-3">Decryption Key:</h2>
            <div>
              <textarea
                id="decrypt-key"
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
            <button className=" flex-1 bg-red-500 hover:bg-red-700 border border-gray-500 rounded-sm w-full p-2 mt-2 mr-2 ">
              <RotateCw size={15} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default DecryptPage;
