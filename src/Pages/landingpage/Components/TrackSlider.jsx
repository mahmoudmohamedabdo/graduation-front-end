import React from "react";

function TrackCard() {
  return (
    <div className="border border-gray-200 rounded-xl shadow-sm w-[220px] p-4 text-left relative bg-white">
      {/* Top Blue Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 rounded-t-xl"></div>

      {/* Content */}
      <h3 className="text-base font-semibold mb-2">UI/UX Design</h3>
      <p className="text-sm text-gray-700 mb-4 leading-snug">
        Showcase your design skills through interface challenges, usability tests,
        and design system questions.
      </p>
      <a href="#" className="text-blue-600 font-semibold text-sm inline-flex items-center gap-1">
        Explore UI/UX Track <span>→</span>
      </a>
    </div>
  );
}

export default function TrackCarousel() {
  return (
    <section className="bg-white py-12 px-4 text-center">
      {/* Title and arrows */}
      <div className="relative mb-2 flex justify-center items-center">
        <h2 className="text-2xl md:text-3xl font-bold">Choose Your Track</h2>
        <div className="absolute right-0 flex gap-2">
          <button className="w-9 h-9 rounded-full border text-blue-600 border-blue-600 hover:bg-blue-50">
            ←
          </button>
          <button className="w-9 h-9 rounded-full border text-white bg-blue-600 hover:bg-blue-700">
            →
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-10">
        Specialized learning paths tailored to your career goals
      </p>

      {/* Cards */}
      <div className="flex justify-center gap-6 flex-wrap">
        <TrackCard />
        <TrackCard />
        <TrackCard />
        <TrackCard />
      </div>
    </section>
  );
}
