import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TaskOverlay({ isClose, isOpen, task, userId, jobApplicationId }) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTextareaChange = (e) => {
    setSubmission(e.target.value);
  };

  const handleSubmit = async () => {
    if (!submission.trim()) return;

    const payload = {
      taskId: task.id,
      userId,
      jobApplicationId,
      submissionNotes: submission,
      submissionLink: submission, // لنفترض أنه نفس الرابط، يمكنك تخصيص حقل آخر إذا أردت
      demoLink: "" // فارغ مؤقتًا
    };

    try {
      setLoading(true);
      const res = await axios.post('http://fit4job.runasp.net/api/UserSubmissions', payload);
      if (res.data.success) {
        console.log('✅ Submission created:', res.data.data);
        setHasSubmitted(true);
        isClose();
      } else {
        console.error('❌ Submission failed:', res.data.message);
      }
    } catch (err) {
      console.error('❌ API Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSubmission('');
      setHasSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !task) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ backgroundColor: 'rgba(156, 163, 175, 0.3)' }}
    >
      <div className="bg-white shadow-xl rounded-xl max-w-3xl w-full mx-4 p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        {/* Close Button */}
        <button
          onClick={isClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

        {/* Modal Content */}
        <div>
          <div className="mb-6">
            <span className="text-xl font-semibold text-gray-900 block mb-1">{task.title}</span>
            <span className="text-sm text-gray-500">
              Deadline: {new Date(task.deadline).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-5">
            <h3 className="text-lg font-semibold mb-2">Task Description</h3>
            <p className="text-gray-700 mb-4">{task.description}</p>

            <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
            <ul className="list-disc list-inside text-gray-700 space-y-1 pl-2 text-sm">
              {task.requirements.split('\n').map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>

            {task.deliverables && (
              <>
                <h4 className="font-semibold text-gray-800 mt-4 mb-2">Deliverables:</h4>
                <p className="text-gray-700 text-sm">{task.deliverables}</p>
              </>
            )}
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
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 transition disabled:opacity-50"
              onClick={handleSubmit}
              disabled={!submission.trim() || loading}
            >
              {loading ? 'Submitting...' : hasSubmitted ? 'Update Submission' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
