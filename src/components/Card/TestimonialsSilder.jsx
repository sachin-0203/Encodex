import React, {useState, useEffect} from "react";
import testimonials from "@/Data/testimonialsData";
import { UserCard } from "./UserCard";
import {motion} from 'framer-motion'

function getValue(width) {
  if (width > 1024) return 20;   
  if (width > 768) return 60;    
  return 100;                    
}

function useResponsiveValue() {
  const [value, setValue] = useState(() => getValue(window.innerWidth));

  useEffect(() => {
    function handleResize() {
      setValue(getValue(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return value;
}



export const TestimonialsSilder = () => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const value = useResponsiveValue();
  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrentIndex((prev) => 
        prev === testimonials.length -1 ? 0 : prev+1
      );
    }, 3000)

    return ()=> clearInterval(interval);
  }, []);


  return (
    <div className=" overflow-hidden mx-auto my-12 relative" >
      <div 
        className="  flex p-5  m-2 transition-transform duration-1000 "
        style={{
          transform: `translateX(-${currentIndex * value}%)`,
          width: `${testimonials.length * 20}%`,
        }}
      >
      {testimonials.map((user, index) => (
        <div
          key={user.name} 
        >
          <UserCard
            avatar={user.avatar}
            name={user.name}
            post={user.post}
            feedback={`"${user.feedback}"`}
          />
        </div>
      ))}
        </div>
    </div>
  );
};

