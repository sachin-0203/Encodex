import React, {useEffect} from 'react';
import { useAuth } from '../../Context/AuthContext';


const  ProtectedRoute = ({children})=>{

  const { accessToken } = useAuth();

  if(!accessToken){
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-700">
        <h1 className="text-5xl font-bold mb-4">Loading...</h1>
        <h3 className='text-xl font-mono mb-5'>Stay Tuned while we're loading your content</h3>
        <p className='text-sm text-red-400' >Its recommended that you should <span className='uppercase' >login/signup</span>  if not</p>

      </div>
    );
  }

  return children;
}

export default ProtectedRoute;