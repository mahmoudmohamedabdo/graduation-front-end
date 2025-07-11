import React, { useState } from 'react';

export default function TaskOverlay({ isClose, isOpen }) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submission, setSubmission] = useState('');

  const handleTextareaChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleSubmit = () => {
    if (!submission.trim()) return;

    console.log('Submission:', submission);
    setHasSubmitted(true);
    isClose();
  };

  if (!isOpen) return null;

  return (
    <div  className="fixed inset-0 flex justify-center items-center z-50 p-4"
  style={{ backgroundColor: 'rgba(156, 163, 175, 0.3)' }}
    >
      <div className="bg-white shadow-xl rounded-xl max-w-3xl w-full mx-4 p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* زر الإغلاق */}
        <button
          onClick={isClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* محتوى الـ Modal */}
        <div>
          <div className="mb-6">
            <span className="text-xl font-semibold text-gray-900 block mb-1">Build a React Todo App</span>
            <span className="text-sm text-gray-500">Deadline: 7/3/2025</span>
          </div>

          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">Task Description</h3>
            <p className="text-gray-700 mb-4">
              Create a simple todo application using React with the ability to add, edit, and delete tasks.
            </p>
            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2 text-sm">
              <li>Use React hooks for state management</li>
              <li>Implement CRUD operations for todos</li>
              <li>Style the application using CSS or a UI library</li>
              <li>Include form validation</li>
              <li>Implement local storage to persist todos</li>
            </ul>
          </div>

          <div>
            <label className="block font-medium text-sm mb-1">Update Your Submission</label>
            <textarea
              rows={3}
              placeholder="Paste your GitHub repo link or code here..."
              className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
              value={submission}
              onChange={handleTextareaChange}
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide a link to your GitHub repository or paste your code directly.
            </p>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 transition"
              onClick={handleSubmit}
              disabled={!submission.trim()}
            >
              {hasSubmitted ? 'Update Submission' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
