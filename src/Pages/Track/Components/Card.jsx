import React, { useState } from 'react';
import reactLogo from '../../../assets/Images/reactLogo.png';
import nextArrow from '../../../assets/Images/nextArrow.png';
import Learning from '../../../assets/Images/LearningArrow.png';
import Level from '../../Level/Level';

export default function Card({ title, description, isPremium, price ,trackId}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="card w-96 bg-base-100 shadow-md text-center rounded-xl p-4 relative z-0">
        {/* Badge in top-left corner */}
        <span
          className={`absolute top-2 left-2 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
            isPremium
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {isPremium ? 'Premium' : 'Free'}
        </span>

        <div className="card-body">
          {/* Logo and Title */}
          <div className="flex flex-col items-center mb-4">
            <img src={reactLogo} alt="Logo" className="w-20 h-20 mb-3" />
            <h2 className="text-xl font-semibold text-[#2563EB]">{title}</h2>
          </div>

          {/* Description */}
          <div className="text-sm text-gray-600 mb-4">
            <p>{description}</p>
          </div>

          {/* Info Badges */}
          <div className="flex justify-center gap-2 mb-5">
            <button className="btn rounded-full h-fit px-4 py-1 text-blue-600 bg-blue-100 text-xs">
              2 skill Levels
            </button>
            <button className="btn rounded-full h-fit px-4 py-1 text-gray-600 bg-gray-100 text-xs font-light">
              7 questions
            </button>
          </div>

         {isPremium && (price !== null && price !== undefined) && (
  <div className="mb-3 text-sm text-gray-700 mt-1">
    Price: <span className="font-bold text-green-600">{price === 0 ? "Free" : price}</span>
  </div>
)}


          <div className="mt-6 flex justify-center items-center text-center">
            <button
              onClick={() => setShowModal(true)}
              className="btn rounded-full flex items-center gap-2 px-3 py-2 text-[#2563EB] bg-[#DBEAFE]"
            >
              <img src={Learning} alt="Start" className="w-4" />
              Start Practicing
              <img src={nextArrow} alt="Arrow" className="w-2" />
            </button>
          </div>
        </div>
      </div>

     {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="z-50 w-full max-w-4xl mx-auto relative">
            <Level
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              trackId={trackId} 
            />
          </div>
        </div>
      )}
    </>
  );
}
