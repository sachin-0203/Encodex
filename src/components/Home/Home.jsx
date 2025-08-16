import React, {useCallback, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../AuthModel/AuthModel";
import { useAuth } from "../../Context/AuthContext";
import { MoveUp } from "lucide-react";
import icons from '../../utils/icons.js'
import { Card } from "../Card/Card";
import { TestimonialsSilder } from "../Card/TestimonialsSilder";

function Home() {
  const {accessToken} = useAuth();
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [authView, setAuthView] = useState("login");
  const navigate = useNavigate();

  useEffect(()=>{
    if(accessToken){
      setShowModal(false)
    }
  },[accessToken])

  useEffect(()=>{
    const handleScroll = ()=>{
      if(window.scrollY > 100){
      setVisible(true)
      }
      else{
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll);
    return ()=> window.removeEventListener('scroll', handleScroll);
  }, [])

  const handleLetBegin= (viewElement) => {
    if(accessToken){
      navigate("/dashboard");
    }else{
      setAuthView(viewElement);
      setShowModal(true);
    }

  }

  const scrollToTop = ()=>{
		window.scrollTo({
			top:0,
			behavior: 'smooth',
		});
	};

  return (
    <div>
      <div id="hero-section" className="relative bg-background text-foreground  dark:bg-background-dark dark:text-text-light">
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultView={authView}
      />
        <div className="h-screen w-full flex flex-col md:flex-row justify-evenly font-mono ">
          <div className="z-10 left-container py-20 text-3xl text-primary text-center flex flex-col gap-20">
              <h1 className="text-[5rem] mt-16" >
                Secure Your Images,
              </h1>
              <h1 className="text-[5rem] text-primary" >Protect Your Privacy</h1>
              <p className=" text-xl text-wrap text-primary  ">"Experience Advance Encryption at Your Fingertips"</p>

            <div className="mt-1">
            <button 
              className="group relative font-medium text-foreground transition-colors duration-[400ms] hover:text-primary px-4 py-2 "
              onClick={()=>handleLetBegin("login")} >

                <span>Let's Begin</span>
                
                {/* TOP */}
                <span className="absolute left-0 top-0 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full hover:rounded-full " />

                {/* RIGHT */}
                <span className="absolute right-0 top-0 h-0 w-[2px] bg-primary transition-all delay-100 duration-200 group-hover:h-full" />

                {/* BOTTOM */}
                <span className="absolute bottom-0 right-0 h-[2px] w-0 bg-primary transition-all delay-200 duration-200 group-hover:w-full" />

                {/* LEFT */}
                <span className="absolute bottom-0 left-0 h-0 w-[2px] bg-primary transition-all delay-300 duration-200 group-hover:h-full" />

              </button>

              
            </div>
          </div>
          {/* <div className="right-container">
            <img src="assets/right-logo.png" alt="home-image" />
          </div> */}
        </div>
				
				<button id="moveTop" onClick={scrollToTop} 
          className={`fixed bottom-[1rem] right-[1rem] bg-primary/90 text-white p-2 rounded-full h-16 border hover:bg-primary transition-opacity duration-400 ${visible? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
					<MoveUp size={20} />
				</button>
        <div className="absolute z-0 top-[90%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex items-center justify-center size-80 rounded-full bg-circle blur-[120px] " />
        <div className="absolute z-0 top-[90%] left-[47%] translate-x-[-120%] translate-y-[-50%] flex items-center justify-center size-60 rounded-full bg-black-500 blur-[100px]"/>

        
      </div>
      
      <div id="about" className=" py-8 md:py-16 px-4 md:px-8 my-8">
        <div>
          <h1 
            className=" text-4xl md:tex[4rem] lg:text-6xl font-bold py-8 text-foreground text-center">
            Features
          </h1>
          <div className="flex  flex-wrap gap-1 justify-center">

            <Card
              icon={icons.icon1} 
              title="hybrid Encryption" 
              text="Ensures maximum security by encrypting the image with AES and securing the key with RSA, combining speed with strong protection."  
            />
            <Card
              icon={icons.icon2} 
              title="smart key guard" 
              text="Each image is encrypted with a unique key, and keys are individually encrypted and stored safely to prevent unauthorized access."  
            />
            <Card
              icon={icons.icon3} 
              title="secure login" 
              text="Google login integration ensures that only verified users can access encryption and decryption functionalities."  
            />
            <Card
              icon={icons.icon4} 
              title="End-to-End Image Privacy" 
              text="Original images are never stored on the server. Encrypted data is handled temporarily and removed after processing."  
            />
            <Card
              icon={icons.icon5} 
              title="Instant Lock & Unlock" 
              text="Simple upload-and-click interface for encrypting or decrypting images—no technical expertise required."  
            />
            <Card
              icon={icons.icon6} 
              title="Smooth UX Everywhere" 
              text="Designed with a responsive interface using React and TailwindCSS, making it accessible on both desktop and mobile devices."  
            />
            
          </div>
        </div>
      </div>

      <div id="guide" className="py-4 px-4 md:px-8 mb-8 text-center">

        <div 
          className="text-foreground text-4xl md:tex[4rem] lg:text-6xl font-bold py-8"
        >
          Guide
        </div>

        <div 
          className="flex flex-wrap gap-4 justify-center text-secondary-foreground bg-secondary rounded-sm">

          <div className="container-items w-1/6 p-4 m-2">
            <h1 className="h-14 w-14 mx-auto bg-background text-primary rounded-full border p-4">
              1
            </h1>
            <h1 className="my-2 capitalize font-bold text-lg">
              upload image
            </h1>
            <p className="text-md">
              Select an image from your device that you want to encrypt.
            </p>
          </div>

          <div className="container-items w-1/6 p-4 m-2">
            <h1 className="h-14 w-14 mx-auto bg-background text-primary rounded-full border p-4">
              2
            </h1>
            <h1 className="my-2 capitalize font-bold text-lg">
              Encrypt & Secure
            </h1>
            <p className="text-md">
              Hit the "Encrypt" button to protect your image with robust AES encryption.
            </p>
          </div>

          <div className="container-items w-1/6 p-4 m-2">
            <h1 className="h-14 w-14 mx-auto bg-background text-primary rounded-full border p-4">
              3
            </h1>
            <h1 className="my-2 capitalize font-bold text-lg">
              Save Your Key
              </h1>
            <p className="text-md">
              Save the generated encryption key & Store it securely on your device.
            </p>
          </div>

          <div className="container-items w-1/6 p-4 m-2">
            <h1 className="h-14 w-14 mx-auto bg-background text-primary rounded-full border p-4">
              4
            </h1>
            <h1 className="my-2 capitalize font-bold text-lg">
              Share Safely
            </h1>
            <p className="text-md">
              Send your encrypted image confidently, knowing it's unreadable without the correct key.
            </p>
          </div>
          <div className="container-items w-1/6 p-4 m-2">
            <h1 className="h-14 w-14 mx-auto bg-background text-primary rounded-full border p-4">
              5
            </h1>
            <h1 className="my-2 capitalize font-bold text-lg">
              Decrypt Anytime
            </h1>
            <p className="text-md">
              upload the encrypted file 
              & your saved key to restore the original image instantly.
            </p>
          </div>
        </div>

        <div>
          <button
           className= "hover:bg-secondary border p-3 m-2 rounded-md bg-transparent text-foreground hover:text-text-light "> 
            <Link to="/guide">
              Detailed Guidance
            </Link>
          </button>
          <p className="text-ring" >Step-by-step tutorial for encryption and decryption</p>
        </div>

      </div>

      <div id="testimonials" className="py-4 px-4 md:px-8 mb-8 ">
        <div className="text-3xl md:text-4xl lg:tex[4rem] font-bold py-8 text-foreground text-center" >
          Where Encodex Shines
        </div>
          <TestimonialsSilder />
      </div>
      
      <div id="signUp-page" className=" py-4 px-4 md:px-8 mb-8 text-center text-text-light bg-text-dark">
        <div className="Heading text-3xl md:text-4xl lg:tex[4rem] font-bold py-8">
          Start Securing Your Data Today!
        </div>
        <div className="Content"> Sign up in just 2 seconds!</div>
        <button
         className= "p-3 m-2 rounded-md text-input hover:text-text-light hover:bg-accent "
         onClick={()=>handleLetBegin("signup")}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home;
