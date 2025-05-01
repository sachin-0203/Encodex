import React, {useCallback, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../AuthModel/AuthModel";
import { useAuth } from "../../Context/AuthContext";
import { use } from "react";
import { MoveUp } from "lucide-react";

function Home() {
  const {accessToken} = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [visible, setVisible] = useState(false);
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
		console.log("Button Clicked")
		window.scrollTo({
			top:0,
			behavior: 'smooth',
		});
	};

  return (
    <div>
      <div id="home-page" className="relative bg-background text-foreground  dark:bg-background-dark dark:text-text-light">
      <AuthModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        defaultView={authView}
      />
        <div className="h-screen w-full flex flex-col md:flex-row justify-evenly font-mono ">
          <div className="left-container py-20 text-3xl text-primary">
            <div>
              <h1 className="text-[4rem]" >
                Secure Your Images 
              </h1>
              <br />
              <h1 className="text-[4rem] text-primary" >Protect Your Privacy</h1>
              <br />
              <p className=" text-lg text-wrap text-secondary ml-20 ">"Experience Advance Encryption at Your Fingertips"</p>
            </div>

            <div className="mt-10">
            <button 
              className="p-3 ml-52 mt-12 rounded-full  text-foreground border border-ring hover:bg-cyan-900 hover:text-white  "
              onClick={()=>handleLetBegin("login")} >
               Let's Begin
              </button>
            </div>
          </div>
          <div className="right-container">
            <img src="assets/right-logo.png" alt="home-image" />
          </div>
        </div>
				
				<button id="moveTop" onClick={scrollToTop} 
          className={`fixed bottom-[1rem] right-[1rem] bg-primary/90 text-primary-foreground p-2 rounded-full h-16 border hover:bg-primary transition-opacity duration-400 ${visible? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        >
					<MoveUp size={20} />
				</button>
        
      </div>

      <div id="about" className="py-8 md:py-16 px-4 md:px-8 my-8">
        <div className="text-center">
          <h1 className="text-4xl md:tex[4rem] lg:text-6xl font-bold py-8 text-foreground">
            Features
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">

            <div 
              className="container-items border bg-card text-card-foreground  rounded-lg w-1/4 p-4 m-4"
            >
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div 
              className="container-items border bg-card text-card-foreground rounded-lg w-1/4 p-4 m-4 "
            >
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div 
              className="container-items border bg-card text-card-foreground
              rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border bg-card text-card-foreground rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border bg-card text-card-foreground rounded-lg  w-1/4 p-4 m-4 ">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border bg-card text-card-foreground rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
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
        className="flex flex-wrap gap-4 justify-center text-secondary-foreground bg-secondary">
          <div className="container-items w-1/6 p-4 m-2">
            <h1>icon</h1>
            <h1>Step - 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, aspernatur!
            </p>
          </div>
          <div className="container-items w-1/6 p-4 m-2">
            <h1>icon</h1>
            <h1>Step - 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, aspernatur!
            </p>
          </div>
          <div className="container-items w-1/6 p-4 m-2">
            <h1>icon</h1>
            <h1>Step - 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, aspernatur!
            </p>
          </div>
          <div className="container-items w-1/6 p-4 m-2">
            <h1>icon</h1>
            <h1>Step - 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, aspernatur!
            </p>
          </div>
          <div className="container-items w-1/6 p-4 m-2">
            <h1>icon</h1>
            <h1>Step - 1</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam, aspernatur!
            </p>
          </div>
        </div>
        <div>
          <button
           className= "hover:bg-secondary border p-3 m-2 rounded-md bg-transparent text-foreground hover:text-text-light "> 
            <Link to="/guide">
              Watch a Demo
            </Link>
          </button>
          <p className="text-ring" >Step-by-step tutorial for encryption and decryption</p>
        </div>
      </div>

      <div id="testimonials" className="py-4 px-4 md:px-8 mb-8 text-center">
        <div className="text-3xl md:text-4xl lg:tex[4rem] font-bold py-8 text-foreground " >
          Where Encodex Shines
        </div>
        <div className=" flex gap-1 p-4 m-2 text-input overflow-auto">
          <div className="card h-[20rem] w-[25rem] bg-destructive/10 text-card-foreground">Card</div>
          <div className="card h-[20rem] w-[25rem] bg-destructive/10 text-card-foreground">Card</div>
          <div className="card h-[20rem] w-[25rem] bg-destructive/10 text-card-foreground">Card</div>
          <div className="card h-[20rem] w-[25rem] bg-destructive/10 text-card-foreground">Card</div>
          <div className="card h-[20rem] w-[25rem] bg-destructive/10 text-card-foreground">Card</div>
        </div>
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
