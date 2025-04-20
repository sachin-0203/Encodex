import React, {useEffect, useState} from 'react';
import { useAuth } from '../../Context/AuthContext';
import { SkeletonModel1, SkeletonModel2, SkeletonModel3, SkeletonModel4 } from '../SkeleFolder/DashSk';


const  ProtectedRoute = ({children})=>{

  const { accessToken } = useAuth();
  const [islargeScreen, setIslargeScreen] = useState(window.innerWidth>= 1024);

  useEffect(()=>{

    const handleResize = () =>{
      setIslargeScreen(window.innerWidth>= 1024)
    }
    window.addEventListener("resize", handleResize)
    return ()=> window.removeEventListener("resize", handleResize)
  }, [])

  if(!accessToken){
    return (
      <div>
        {
          islargeScreen? (
            <div className='flex' >
              <SkeletonModel1 />
              <div className='space-y-2 px-0.5' >
                <SkeletonModel2 />
                <div className='flex px-0.5' >
                  <SkeletonModel3 /> 
                  <SkeletonModel4 /> 
                </div>
              </div>
            </div>
          ):(
            <div className="flex flex-col items-center justify-center h-screen text-gray-700">

              <h1 className="text-5xl font-bold mb-4">Loading...</h1>
              <h3 className='text-xl font-mono mb-5'>Stay Tuned while your content in Loading. </h3>
              <p className='text-sm ' >Its recommended that you should {" "} 
                <span className='uppercase text-red-400' >login / signup</span> {" "} if not
              </p>
        
            </div>
          )
        } 
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;