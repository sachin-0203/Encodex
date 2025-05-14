import React from "react";
import icons from '../../utils/icons.js'

export const UserCard = ({avatar,name,post,feedback}) => {
  return(
    <div>
    <div  
      className=" border bg-card text-card-foreground  rounded-lg w-[35%] h-[14rem] min-w-[22.2rem] min-h-[14rem] p-5 pr-7 m-[1rem] shadow-custom-dark text-right transition-all duration-200 relative flex flex-col"
    >

        <img src={avatar} className="absolute top-[-3rem] left-8 size-24 rounded-full border-2 border-primary mx-3 bg-gray-700 " />
        <img src={icons.quote} className="absolute right-7 top-[-2rem] size-11 transform scale-x-[-1]  "  />
        <img src={icons.quote} className="absolute left-7 bottom-[-1.3rem] size-11  "  />

        <div className="flex justify-end">
          <div className="my-2">
            <h1 className="text-lg uppercase font-serif tracking-widest ">
              {name}
            </h1>
            <p className="text-sm font-mono capitalize">
            {post}
            </p>
          </div>
        </div>
        
        <div className="text-md mt-2 ">
          {feedback}
        </div>

      </div>

      
    </div>
    

  );
};
