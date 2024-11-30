import React from "react";
import { background, gradient, grid, heroBackground, icp } from "./assets";
import { useNavigate } from "react-router-dom";
import IC from "ic";

// Section
const Section = ({ children, styles, id }) => {
  return (
    <div
      id={id}
      className={`${styles} sm:border-r sm:border-b sm:border-l border-gray-700 relative`}
    >
      <div className="plus hidden sm:block absolute text-2xl font-medium right-[-7px] bottom-[-16px] text-gray-600">
        +
      </div>
      <div className="plus hidden sm:block absolute text-2xl font-medium left-[-7px] bottom-[-16px] text-gray-600">
        +
      </div>
      {children}
    </div>
  );
};

// Navbar
const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="navbar fixed left-0 right-0 top-0 z-[5] px-5 py-4 flex items-center justify-between border-b border-gray-700">
      <div className="h5 logo flex items-center">
        <img src="" alt="" className="me-2" />
        <h2 onClick={() => scrollToSection("home")}>Triple Entry</h2>
      </div>
      <div className="navlink flex items-center gap-x-10 text-[10px] lg:text-[12px]">
        <div className="cursor-pointer" onClick={() => scrollToSection("home")}>
          <h5>HOME</h5>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => scrollToSection("about")}
        >
          <h5>ABOUT US</h5>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => scrollToSection("support")}
        >
          <h5>SUPPORT</h5>
        </div>
      </div>
      <div className="acount hidden sm:flex text-end gap-5 w-24">
        <img src={icp} className="w-12" />
      </div>
    </div>
  );
};

const Hero = () => {
  const navigate = useNavigate();
  const styles = "mt-[77px] h-[750px]";

  return (
    <Section id={"home"} styles={styles}>
      <img
        src={grid}
        className="absolute left-1/2 transform -translate-x-1/2"
      />
      <img
        src={heroBackground}
        alt=""
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[-1]"
      />
      <div className="title text-center z-[1] absolute left-0 right-0 top-[80px] md:top-[120px]">
        <h3 className="h3 font-bold">
          ICP Blockchain-Based <br /> Corporate Cash Management Revolution
        </h3>
        <p className="my-5">
          Create financial efficiency and confidence in every transaction.
        </p>
        <button
          className="button text-[15px] px-5 py-3 bg-white text-black rounded"
          onClick={() => {
            IC.getAuth(async (authClient) => {
              authClient.login({
                ...IC.defaultAuthOption,
                onSuccess: () => {
                  navigate("/Role");
                },
                onError: (error) => {
                  console.log(error);
                },
              });
            });
          }}
        >
          launch app
        </button>
      </div>
      <div className="baner flex items-center justify-center w-[90%] lg:w-[55%] bg-white z-[2] absolute left-1/2 transform -translate-x-1/2 top-[500px] sm:top-[450px] rounded-xl bg-gradient-to-br from-color-1 via-color-2 to-color-3">
        <div className="w-[99.4%] h-[99%] bg-white rounded-xl overflow-hidden">
          <img src={background} className="w-full" />
        </div>
        <div className="python hidden md:block absolute w-[100px] h-[100px] rounded-lg right-[-50px] bottom-[120px]"></div>
        <div className="python hidden md:block absolute w-[100px] h-[100px] rounded-lg left-[-50px] bottom-[90px]"></div>
      </div>
    </Section>
  );
};

const About = () => {
  return (
    <Section id={"about"}>
      <div
        className="relative sm:pt-40 pt-20 h-screen flex items-center"
        id="about"
      >
        <div className="container about-section flex justify-center">
          <div className="font-medium">
            <h4 className="h5 text-center mb-5">About Triple Entry</h4>
            <h6 className="md:h5 text-n-2 font-thin text-center">
              Triple Entry is an innovative application for corporate cash
              management based on Internet Computer (ICP) blockchain technology.
              This application ensures transparency, security and efficiency in
              every company financial transaction. With a triple entry
              accounting mechanism, data is recorded automatically in a
              decentralized system, reducing the risk of errors and
              manipulation. Suitable for modern companies that prioritize trust
              and accuracy, Triple Entry provides a cash management solution
              that is trusted and ready to face the future.
            </h6>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Support = () => {
  return (
    <Section id={"support"} styles={"py-24"}>
      <h5 className="h5 text-center mb-10">Support by</h5>
      <div className="python  w-[160px] h-[150px] rounded-lg mx-auto p-2">
        <img src={icp} className="w-[100px] mx-auto" />
        <p className="text-sm">Internet Computer</p>
      </div>
      <img
        src={gradient}
        className="absolute top-[-500px] opacity-10 -z-1 w-[1000px]"
      />
    </Section>
  );
};

const Footer = () => {
  return (
    <Section styles={"py-15"}>
      <div className="flex flex-col sm:flex-row items-center justify-around">
        <div className="sm:text-end text-center font-thin text-[13px]">
          Coprright © 2024. Triple Entry All rights reserved
        </div>
        <div className="sosmed flex items-center mt-10 sm:mt-0"></div>
      </div>
    </Section>
  );
};

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <div className="sm:px-5">
        <Hero />
        <About />
        <Support />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
