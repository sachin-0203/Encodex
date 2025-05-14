import React, {useState, useEffect} from "react";
import testimonials from "@/Data/testimonialsData";
import { UserCard } from "./UserCard";

export const TestimonialsSilder = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrentIndex((prev) => 
        prev === testimonials.length -1 ? 0 : prev+1
      );
    }, 1500)

    return ()=> clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden mx-auto my-12 relative" >
      <div 
        className=" flex p-5 py-10 m-2 transition-transform duration-1000 "
        // style={{transform: `translateX(-${currentIndex * 31}%)`}}

      >
          {testimonials.map((user,index) =>(
            <UserCard 
              key={index}
              avatar={user.avatar}
              name={user.name}
              post={user.post}
              feedback={`"${user.feedback}"`}
            />
          ))} 
        </div>
    </div>
  );
};
