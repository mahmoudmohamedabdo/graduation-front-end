import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../../layouts/Navbar';
import CourseCard from './Components/CourseCard'
import NewJops from './Components/NewJobs';
import Footer from '../../layouts/Footer';
import img1 from "../../assets/Images/img1.png";
import img2 from "../../assets/Images/img2.png";
import img3 from "../../assets/Images/img3.png";
import img4 from "../../assets/Images/img4.png";
import rightArrow from '../../assets/Images/rightArrow.png';
import leftArrow from '../../assets/Images/leftArrow.png';
import blackArrow from '../../assets/Images/blackArrow.png'


export default function HomePage() {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth',
    });
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
  };

  useEffect(() => {
    const container = scrollRef.current;
    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();
    return () => container.removeEventListener('scroll', checkScrollPosition);
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <main className="py-12 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-8">Welcome back, Rola Alaa</h3>

          {/* Hero Content */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-[#61758A]">Master Your</h1>
              <h2 className="text-5xl font-bold text-[#1E7CE8]">Technical Interviews</h2>
              <p className="text-gray-700 max-w-2xl mx-auto">
                Join thousands of developers who've landed their dream jobs. Practice with real interview questions,
                get hired by top companies, and advance your career with our comprehensive platform.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded inline-flex items-center gap-2">
                Let's Practice
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>

            {/* Hero Images */}
            <div className="users">
              <div className="row1 flex">
                <div style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tl-4xl transition duration-300 ease-in-out hover:-translate-y-2 hover:-translate-x-2">
                  <img src={img1} alt="" className="w-full h-auto" />
                </div>
                <div style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-tr-4xl transition duration-300 ease-in-out hover:-translate-y-2 hover:translate-x-2">
                  <img src={img2} alt="" />
                </div>
              </div>
              <div className="row2 flex">
                <div style={{ backgroundColor: '#2485E4', borderColor: '#F2F6FF' }}
                  className="m-3 border-5 rounded-bl-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:-translate-x-2">
                  <img src={img3} alt="" />
                </div>
                <div style={{ backgroundColor: '#428EB7', borderColor: '#F2F6FF' }}
                  className="m-3 border-4 rounded-br-4xl transition duration-300 ease-in-out hover:translate-y-2 hover:translate-x-2">
                  <img src={img4} alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* Section Title & Arrows */}
          <div className="flex justify-between items-center mt-16 mb-4">
            <h3 className="text-2xl font-semibold">All Tracks</h3>
            <div className="icons flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={isAtStart}
                className={`${isAtStart ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <img src={rightArrow} alt="Left" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={isAtEnd}
                className={`${isAtEnd ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <img src={leftArrow} alt="Right" />
              </button>
            </div>
          </div>

          {/* Course Cards*/}
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2">
            {Array(6).fill().map((_, index) => (
              <div key={index} className="flex-shrink-0">
                <CourseCard />
              </div>
            ))}
          </div>
         
         {/* Jop Cards Header */}
          <div className="flex justify-between items-center mt-16 mb-4 px-2 sm:px-0">
            <h3 className="text-2xl font-semibold">New Jops</h3>
            <div className="icons flex items-center gap-2 cursor-pointer text-blue-600 font-semibold">
              View All
              <img src={blackArrow} alt="" className="w-5 h-5" />
            </div>
          </div>

          {/* Jop Cards */}
          <div className="flex  gap-4 sm:gap-6 pb-2 justify-center lg:justify-start">
            {Array(4).fill().map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72 sm:w-72">
                <NewJops />
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer/>
    </div>
  );
}
