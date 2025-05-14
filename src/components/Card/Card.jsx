import React from "react";

export const Card = ({icon,title,text}) => {
  return(
    <div  
      className=" border bg-card text-card-foreground  rounded-lg w-[30%] h-[15rem] min-w-[20rem] min-h-[16rem] p-3 m-[1rem] shadow-custom-dark text-center transition-all duration-200 flex flex-col"
    >
      <img src={icon} className="size-20 mx-auto mb-3" />
      <h1 className="text-lg my-2 uppercase font-serif ">
        {title}
      </h1>
      <p className="">
       {text}
      </p>
    </div>
    

  );
};
