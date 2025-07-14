import React, { useRef, useState, useEffect } from "react";
import leftArrow from "../../../assets/Images/leftArrow.png";
import rightArrow from "../../../assets/Images/rightArrow.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function TrackCard({ name, description }) {
  const navigate=useNavigate()
 const goToLoginPage=()=>
 {
  navigate('/login')
 }
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm w-[220px] p-4 text-left relative bg-white flex flex-col justify-between min-h-[260px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-xl"></div>

      <div className="flex-grow">
        <h3 className="text-base font-semibold mb-2">{name}</h3>
        <p className="text-sm text-gray-700 leading-snug">{description}</p>
      </div>

      <a href="#" className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1 mt-4" onClick={goToLoginPage}>
        Explore {name} Track <span>→</span>
      </a>
    </div>
  );
}





export default function TrackCarousel() {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [tracks, setTracks] = useState([]);

  const baseUrl = "/api/TrackCategories";

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get(`${baseUrl}/all`, {
          headers: { Accept: "text/plain" },
        });
        const trackData = Array.isArray(response.data.data) ? response.data.data : [];
        setTracks(trackData);
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setTracks([]);
      }
    };
    fetchTracks();
  }, []);

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
    setIsAtEnd(container.scrollLeft + container.offsetWidth >= container.scrollWidth - 10);
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
      <div className="relative mb-2 flex justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Choose Your Track</h2>
        <div className="absolute right-0 flex gap-2">
          <button onClick={() => handleScroll("left")} disabled={isAtStart}
            className={`${isAtStart ? "opacity-30 cursor-not-allowed" : ""}`}>
            <img src={rightArrow} alt="Left" />
          </button>
          <button onClick={() => handleScroll("right")} disabled={isAtEnd}
            className={`${isAtEnd ? "opacity-30 cursor-not-allowed" : ""}`}>
            <img src={leftArrow} alt="Right" />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-10">
        Specialized learning paths tailored to your career goals
      </p>

      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-2">
        {tracks.map((track) => (
          <div key={track.id || track._id} className="flex-shrink-0">
            <TrackCard name={track.name} description={track.description} />
          </div>
        ))}
      </div>
    </section>
  );
}

