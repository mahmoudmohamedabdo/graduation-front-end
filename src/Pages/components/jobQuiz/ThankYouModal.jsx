// Pages/components/jobQuiz/ThankYouModal.jsx
import React from "react";

export default function ThankYouModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center relative">
        {/* علامة الصح المكبرة */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md border-4 border-green-500 -mt-16">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* النص */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank You</h2>
        <p className="text-gray-600 mb-6">
          Your response has been submitted!
        </p>

        {/* زر OK */}
        <button
          onClick={onClose}
          className="bg-green-600 text-white font-semibold px-6 py-2 rounded hover:bg-green-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
}
