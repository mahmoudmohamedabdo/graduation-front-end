import React from 'react';
import arrow from '../../assets/Images/arrow.png';
import exit from '../../assets/Images/Exit.png';
import stars from '../../assets/Images/stars.png';
import choice from '../../assets/Images/choice.png';
import mc from '../../assets/Images/true.png';
import code from '../../assets/Images/code.png';
import { useNavigate } from 'react-router-dom';

export default function Level({ isOpen, onClose }) {
const navigate=useNavigate()
const openExamPage=()=>
{
navigate('/exam')
}  
if (!isOpen) return null;

  return (
   <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col z-50 relative" onClick={e => e.stopPropagation()}>

      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col "
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-[#EEF2FF] to-[#EFF6FF] px-6 py-4 flex items-center justify-between rounded-t-2xl p-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Select Skill Level</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <img src={arrow} alt="arrow" className="w-4 h-4" />
              <span>React</span>
            </div>
          </div>
          <button onClick={onClose}>
            <img src={exit} alt="Close" className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-4 space-y-6 overflow-y-auto flex-1 p-3">
          <p className="text-center text-sm text-gray-500">
            Choose your skill level to get questions tailored to your expertise
          </p>

          {/* === FRESH LEVEL === */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">Fresh Level</span>
              <img src={stars} alt="stars" className="w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">
              New to React – Basic concepts and fundamentals
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Difficulty */}
              <div className="flex-1 bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2">Difficulty Breakdown</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="bg-[#DCFCE7] text-[#15803D] px-2 py-1 rounded-full">Easy</span>
                  <span>3</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="bg-[#FEF9C3] text-[#A16207] px-2 py-1 rounded-full">Medium</span>
                  <span>2</span>
                </div>
              </div>

              {/* Question Types */}
              <div className="flex-1 bg-white px-4 py-2 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2">Question Types</h4>
                <div className="flex justify-between items-center text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <img src={choice} alt="multiple choice" className="w-4 h-4 mb-3" />
                    <p>multiple choice</p>
                  </div>
                  <span>2</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <img src={mc} alt="true false" className="w-4 h-4 mb-3" />
                    <p>true false</p>
                  </div>
                  <span>2</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <img src={code} alt="code writing" className="w-4 h-4 mb-3" />
                    <p>code writing</p>
                  </div>
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>🕒 10 min</span>
                <span className="text-[#1C79EA] cursor-pointer">2 questions</span>
              </div>
              <button className="btn btn-sm rounded-full text-white bg-[#1C79EA] px-4" onClick={openExamPage} >
                Start Level
              </button>
            </div>
          </div>

          {/* === JUNIOR LEVEL === */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold">Junior Level</span>
              <img src={stars} alt="stars" className="w-4 h-4" />
            </div>
            <p className="text-sm text-gray-500">
              1–2 years experience – Intermediate concepts and patterns
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Difficulty */}
              <div className="flex-1 bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2">Difficulty Breakdown</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span className="bg-[#FEF9C3] text-[#A16207] px-2 py-1 rounded-full">Medium</span>
                  <span>1</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="bg-[#FEE2E2] text-[#B91C1C] px-2 py-1 rounded-full">Hard</span>
                  <span>1</span>
                </div>
              </div>

              {/* Question Types */}
              <div className="flex-1 bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2">Question Types</h4>
                <div className="flex justify-between items-center text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <img src={choice} alt="multiple choice" className="w-4 h-4 mb-3" />
                    <p>multiple choice</p>
                  </div>
                  <span>1</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <img src={code} alt="code writing" className="w-4 h-4 mb-3" />
                    <p>code writing</p>
                  </div>
                  <span>1</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <span>🕒 10 min</span>
                <span className="text-[#1C79EA] cursor-pointer">2 questions</span>
              </div>
              <button className="btn btn-sm rounded-full text-white bg-[#1C79EA] px-4" onClick={openExamPage}>
                Start Level
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
