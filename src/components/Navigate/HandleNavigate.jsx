import React from "react";
import { useNavigate } from "react-router-dom";

const HandleNavigate = ({ to, children, className = "" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);

    setTimeout(() => {
      window.scrollTo({
			top:0,
			behavior: 'smooth',
		});
    }, 100);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export default HandleNavigate;


