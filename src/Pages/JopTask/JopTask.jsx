import React, { useState, useEffect } from 'react';
import TaskOverlay from './Components/TaskOvelay';
import JopNav from '../../layouts/JopNav';

export default function JopTask() {
  const [showOverlay, setShowOverlay] = useState(false);

  const handleOpenOverlay = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };
  useEffect(() => {
    if (showOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showOverlay]);

  return (
    <div className="container px-4 mx-auto w-sm-full">
      {/* Header */}
      <div className="p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">Frontend Development</h2>
        </div>

        <JopNav/>
      </div>

      {/* Jop Task */}
      <h2 className="text-xl font-bold mx-2 my-6">Technical Task</h2>
      <div className="bg-white p-6 rounded shadow-sm m-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold text-gray-900 mb-6">Build a React Todo App</span>
          <span className="inline-flex mb-3 items-center gap-1 text-[#166534] text-[13px] bg-[#DCFCE7] rounded-2xl px-3 py-1">submitted</span>
        </div>
        <span className="font-normal my-5 mb-6">
          Create a simple todo application using React with the ability to add, edit, and delete tasks.
        </span>
        <h3 className="text-md my-1 font-semibold text-gray-800 mb-2">Requirements:</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
          <li>Use React hooks for state management</li>
          <li>Implement CRUD operations for todos</li>
          <li>Style the application using CSS or a UI library</li>
          <li>Include form validation</li>
          <li>Implement local storage to persist todos</li>
        </ul>
        <div className="flex justify-between items-center my-2">
          <span className="text-[#6B7280] font-light text-[11px]">Deadline: 7/3/2025</span>
          <button
            className="btn bg-[#16A34A] text-white rounded-lg px-8 py-2"
            onClick={handleOpenOverlay}
          >
            View Details
          </button>
        </div>
      </div>

      <TaskOverlay isClose={handleCloseOverlay} isOpen={showOverlay} />
    </div>
  );
}
