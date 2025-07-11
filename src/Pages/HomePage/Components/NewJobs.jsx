import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewJops() {
  const navigate =useNavigate();
  const openJopDetailsPage=()=>{
    navigate('/jopDetails')
  }
  return (
    <div className="w-72 rounded-xl overflow-hidden shadow-md bg-base-100">
      <div className="p-0">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#298DE0] to-[#006AC2] p-4 rounded-t-xl">
          <h2 className="w-full text-xl font-bold text-white mb-1">
            Front End Angular Developer
          </h2>
          <p className="text-white text-sm tracking-wider">
            Tech Company
          </p>
        </div>


        {/* Job Info */}
        <div className="mt-4 px-4 text-sm text-gray-800 space-y-2">
          <p>
            Experienced (Non-Manager) · 3-5 Yrs of Exp · Angular · Bootstrap · APIs · CSS · Design · IT · JSON · JavaScript · Software Development
          </p>
        </div>

        {/* Skills (All React) */}
        <div className="flex flex-wrap gap-2 mt-4 px-4">
          {Array(6).fill("React").map((skill, index) => (
            <span
              key={index}
              className="bg-[#E6EEFF] text-sm px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Button */}
        <div className="mt-5 mb-4 px-4 text-center">
          <button className="btn rounded-full text-white bg-[#1C79EA] px-6" onClick={openJopDetailsPage}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}
