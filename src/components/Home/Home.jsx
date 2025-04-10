import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div id="home-page" className="dark:bg-background-dark dark:text-text-light">
        <div className=" h-100vh w-full flex flex-row justify-evenly">
          <div className="left-container py-20 text-3xl">
            <div>
              <h1 className="text-5xl ml-20" >
                Secure Your Images 
              </h1>
              <br />
              <h1 className="text-5xl ml-32" >Protect Your Privacy</h1>
              <br />
              <p className="w-auto text-sm ml-36 text-green-400">"Experience Advance Encryption at Your Fingertips"</p>
            </div>

            <div className="mt-10">
            <Link className="hover:bg-gradient-to-r from-green-900 to-lime-900 border border-green-950 p-3 ml-52 mt-12 rounded-md bg-white text-green-900 hover:text-text-light " to="/AuthPage"> Let's Begin</Link>
            </div>
          </div>
          <div className="right-container">
            <img src="assets/right-logo.png" alt="home-image" />
          </div>
        </div>
        
      </div>

      <div id="about" className="py-8 md:py-16 px-4 md:px-8 my-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold py-8 text-text-dark">
            Features
          </h1>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="container-items border border-accent-dark rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border border-accent-dark rounded-lg w-1/4 p-4 m-4 ">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border border-accent-dark rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border border-accent-dark rounded-lg w-1/4 p-4 m-4">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border border-accent-dark rounded-lg  w-1/4 p-4 m-4 ">
              <h1>icon</h1>
              <h1>Title</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam qui voluptate
                vitae fugiat exercitationem?
              </p>
            </div>
            <div className="container-items border border-accent-dark rounded-lg w-1/4 p-4 m-4">
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
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold py-8 text-text-dark">
          Guide
        </div>
        <div className="flex flex-wrap gap-4 justify-center bg-accent-dark text-text-light">
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
          <button className= "hover:bg-gradient-to-r from-blue-500 to-purple-600 border border-accent-dark p-3 m-2 rounded-md bg-transparent text-accent-dark hover:text-text-light "> 
            <Link to="/guide">
            Watch a Demo
            </Link>
          </button>
          <p>Step-by-step tutorial for encryption and decryption</p>
        </div>
      </div>

      <div id="testimonials" className="py-4 px-4 md:px-8 mb-8 text-center">
        <div className="text-3xl md:text-4xl lg:text-5xl font-bold py-8 text-text-dark" >
          Where Encodex Shines
        </div>
        <div className="size-18 p-4 m-2">
          This contain the User Card
        </div>
      </div>
      
      <div id="signUp-page" className="text-text-light py-4 px-4 md:px-8 mb-8 text-center bg-background-dark">
        <div className="Heading text-3xl md:text-4xl lg:text-5xl font-bold py-8">
          Start Securing Your Data Today!
        </div>
        <div className="Content"> Sign up in just 2 seconds!</div>
        <button className= "hover:bg-gradient-to-r from-blue-500 to-purple-600 border border-accent-dark p-3 m-2 rounded-md bg-white text-accent-dark hover:text-text-light ">Get Started</button>
      </div>
    </div>
  )
}

export default Home;
