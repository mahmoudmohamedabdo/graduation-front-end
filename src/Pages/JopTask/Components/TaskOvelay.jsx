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

    const jobAppId = jobApplicationId || localStorage.getItem('applicationId');
    const token = localStorage.getItem('authToken');

    // Validate required values
    if (!userId || !jobAppId || !task?.id || !token) {
      console.error('❌ Missing values:', {
        userId,
        jobAppId,
        taskId: task?.id,
        token: token ? 'Present' : 'Missing',
      });
      return alert('Incomplete data or you are not logged in.');
    }

    const payload = {
      taskId: parseInt(task.id),
      userId: parseInt(userId),
      jobApplicationId: parseInt(jobAppId),
      submissionNotes: submission,
      submissionLink: submission,
      demoLink: submission.startsWith('http') ? submission : 'https://example.com',
    };

    console.log('📦 Submitting payload:', payload);

    try {
      setLoading(true);
      const res = await axios.post(
        'http://fit4job.runasp.net/api/TaskSubmissions',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      console.log('✅ Submission Response:', res.data);

      if (res.data.success) {
        alert('✅ Submission created successfully');
        setHasSubmitted(true);
        isClose();
      } else {
        console.error('❌ Submission failed:', res.data.message);
        alert(`Submission failed: ${res.data.message}`);
      }
    } catch (err) {
      console.error('❌ Error submitting task:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        } : null,
      });
      if (err.response) {
        alert(`API Error: ${err.response.data.message || 'Request failed with status ' + err.response.status}`);
        if (err.response.status === 401) {
          alert('Unauthorized. Please log in again.');
          localStorage.removeItem('authToken');
        } else if (err.response.status === 405) {
          alert('Method Not Allowed. Please check the API endpoint with your backend team.');
        }
      } else {
        alert('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSubmission('');
      setHasSubmitted(false);
      console.log('ℹ️ TaskOverlay opened with task:', task);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-gray-400 bg-opacity-30">
      <div className="bg-white shadow-xl rounded-xl max-w-3xl w-full mx-4 p-6 relative overflow-y-auto max-h-[90vh] border border-gray-200">
        <button
          onClick={isClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ✕
        </button>

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