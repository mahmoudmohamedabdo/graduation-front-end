import React from "react";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";
import LearningTracks from "./Components/LearningTracks";
import TrackSlider from "./Components/TrackSlider";
import CallToAction from "./Components/CallToAction";


import img1 from "../../assets/Images/img1.png";
import img2 from "../../assets/Images/img2.png";
import img3 from "../../assets/Images/img3.png";
import img4 from "../../assets/Images/img4.png";

export default function LandingPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <main className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">
            Welcome back, Rola Alaa
          </h3>

          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            {/* Text Section */}
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold" style={{ color: "#61758A" }}>
                Master Your
              </h1>
              <h2 className="text-5xl font-bold" style={{ color: "#1E7CE8" }}>
                Technical Interviews
              </h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join thousands of developers who've landed their dream jobs.
                Practice with real interview questions, get hired by top
                companies, and advance your career with our comprehensive
                platform.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2">
                Let's Practice
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </button>
            </div>

            {/* Images Section */}
            <div className="users">
              <div className="row1 flex">
                <div
                  style={{
                    backgroundColor: "#428EB7",
                    borderColor: "#F2F6FF",
                  }}
                  className="m-3 border-5 rounded-tl-4xl transition duration-300 ease-in-out hover:-translate-y-2"
                >
                  <img src={img1} alt="" className="w-full h-auto" />
                </div>
                <div
                  style={{
                    backgroundColor: "#428EB7",
                    borderColor: "#F2F6FF",
                  }}
                  className="m-3 border-5 rounded-tr-4xl transition duration-300 ease-in-out hover:-translate-y-2"
                >
                  <img src={img2} alt="" />
                </div>
              </div>
              <div className="row2 flex">
                <div
                  style={{
                    backgroundColor: "#428EB7",
                    borderColor: "#F2F6FF",
                  }}
                  className="m-3 border-5 rounded-bl-4xl transition duration-300 ease-in-out hover:-translate-y-2"
                >
                  <img src={img3} alt="" />
                </div>
                <div
                  style={{
                    backgroundColor: "#428EB7",
                    borderColor: "#F2F6FF",
                  }}
                  className="m-3 border-5 rounded-br-4xl transition duration-300 ease-in-out hover:-translate-y-2"
                >
                  <img src={img4} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      
      
      <LearningTracks />
      <TrackSlider /> 
      <CallToAction />     
      <Footer />      
    </div>
  );
}
