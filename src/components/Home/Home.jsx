import React from "react";

function Home() {
  return (
    <div>
      <div id="home-page">
        <div className=" h-100vh w-full flex flex-row justify-evenly">
          <div className="left-container py-20 text-3xl">
            <div>
              <h1>
                <span>SECURE</span> Your
              </h1>
              <h1>
                <span>IMAGES</span> with
              </h1>
              <h1>
                just <span>ONE CLICK</span>
              </h1>
            </div>

            <div>
              <button>Let's Begin ➡️</button>
            </div>
          </div>
          <div className="right-container">
            <img src="right-logo.png" alt="home-image" />
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-around">
            <h2>Secure Your images</h2>
            <h2>Double Encrypted</h2>
            <h2>Highly Secure</h2>
          </div>
        </div>
      </div>

      <div id="about" className="py-8 md:py-16 px-4 md:px-8 my-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold py-8">
            Highlights
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
        <div className="text-4xl md:text-5xl lg:text-6xl font-bold py-8">Guide</div>
        <div></div>
      </div>
    </div>
  );
}

export default Home;
