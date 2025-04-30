import React, {useEffect, useState} from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';


const  ProtectedRoute = ({children})=>{

  const { accessToken } = useAuth();
 

  if(!accessToken){
    return (
      <div>
        
            <div className="flex flex-col items-center justify-center h-screen text-gray-700">

              <h1 className="text-5xl font-bold mb-4">Loading...</h1>
              <h3 className='text-xl font-mono mb-5'>Stay Tuned while your content become ready </h3>
              <p className='text-sm text-red-800 ' >*Its recommended that you should visit {" "} 
                <span className='uppercase underline text-blue-400 p-2'
                 ><Link to="/"> home </Link></span> {" "} to registered yourself
              </p>
        
            </div> 
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;