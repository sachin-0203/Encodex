import React from "react";

const About = () => {
  return (
    <div id="about-page" className="px-4 py-12 max-w-7xl mx-auto text-center">
      
      {/* Hero Section */}
      <section id="hero-section" className="mb-16">
        <h1 className="text-4xl md:text-6xl font-bold capitalize mb-4 text-primary">About Encodex</h1>
        <h3 className="text-lg md:text-2xl mb-6">Revolutionizing Image Security</h3>
        <p className="max-w-3xl mx-auto text-sm md:text-base">
          Encodex is a state-of-the-art platform designed to protect your sensitive images with cutting-edge encryption technology.
          Our mission is to ensure privacy and security in a world where data breaches are increasingly common.
        </p>
      </section>

      {/* Why Encodex Section */}
      <section className="mb-20">
        <h2 className="text-3xl md:text-5xl font-bold capitalize mb-6">Why Encodex?</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="md:w-1/2 text-left">
            <p className="text-sm md:text-base mb-4">
              In a world of increasing data breaches and privacy concerns,
              protecting visual data has become crucial. Encodex empowers users to
              safeguard their images securely and effortlessly.
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base">
              <li>Protect sensitive personal and professional image data</li>
              <li>Combat unauthorized access and cyber threats</li>
              <li>Seamless encryption and decryption experience</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section>
        <h2 className="text-3xl md:text-5xl font-bold capitalize mb-10">Core Features</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card text-card-foreground rounded-xl w-full sm:w-[45%] md:w-[30%] p-6 text-left hover:shadow-lg transition"
            >
              <div className="mb-3 text-primary text-2xl">📌 Icon</div>
              <h3 className="text-lg font-semibold mb-2">Feature Title</h3>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis
                repellat error veritatis ullam facere quibusdam.
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;

