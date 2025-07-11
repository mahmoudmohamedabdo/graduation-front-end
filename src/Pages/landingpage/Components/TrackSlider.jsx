import React, { useRef, useState, useEffect } from "react";
import leftArrow from "../../../assets/Images/leftArrow.png";
import rightArrow from "../../../assets/Images/rightArrow.png";

function TrackCard() {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm w-[220px] p-4 text-left relative bg-white">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-xl"></div>
      <h3 className="text-base font-semibold mb-2">UI/UX Design</h3>
      <p className="text-sm text-gray-700 mb-4 leading-snug">
        Showcase your design skills through interface challenges, usability tests,
        and design system questions.
      </p>
      <a
        href="#"
        className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1"
      >
        Explore UI/UX Track <span>→</span>
      </a>
    </div>
  );
}

export default function TrackCarousel() {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth;
    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(
      container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScrollPosition);
    checkScrollPosition();
    return () => container.removeEventListener("scroll", checkScrollPosition);
  }, []);

  return (
    <section className="bg-white py-12 px-4 text-center max-w-7xl mx-auto">
      {/* Title and arrows */}
      <div className="relative mb-2 flex justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Choose Your Track</h2>
        <div className="absolute right-0 flex gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={isAtStart}
            className={`${isAtStart ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <img src={rightArrow} alt="Left" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={isAtEnd}
            className={`${isAtEnd ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <img src={leftArrow} alt="Right" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-10">
        Specialized learning paths tailored to your career goals
      </p>

      {/* Scrollable Track Cards */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2"
      >
        {Array(6)
          .fill()
          .map((_, index) => (
            <div key={index} className="flex-shrink-0">
              <TrackCard />
            </div>
          ))}
      </div>
    </section>
  );
}
