// Pages/JobQuizPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuizCard from "./components/jobQuiz/QuizCard";
import QuizModal from "./components/jobQuiz/QuizModal";
import JopNav from "../layouts/JopNav";

export default function JobQuizPage() {
  const { id } = useParams();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!authToken || !userId) {
        setError('Please log in to view job details.');
        return;
      }

      try {
        const response = await fetch(`http://fit4job.runasp.net/api/Jobs/${id}`, {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch job details.');
        
        const data = await response.json();
        if (data?.success && data.data) {
          setJob(data.data);
        } else {
          throw new Error(data?.message || 'Invalid job data.');
        }
      } catch (err) {
        setError('Error fetching job details: ' + err.message);
      }
    };

    fetchJobDetails();
  }, [id, authToken, userId]);

  // Fetch quizzes for this job
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!authToken || !userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Replace this with your actual API endpoint for fetching quizzes
        const response = await fetch(`http://fit4job.runasp.net/api/Jobs/${id}/quizzes`, {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.success && data.data) {
            setQuizzes(Array.isArray(data.data) ? data.data : []);
          } else {
            setQuizzes([]);
          }
        } else if (response.status === 404) {
          // No quizzes found for this job
          setQuizzes([]);
        } else {
          throw new Error('Failed to fetch quizzes.');
        }
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [id, authToken, userId]);

  const handleStart = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  if (error) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="p-4 sm:p-6 bg-gray-50 shadow-md">
          <div className="bg-white p-4 sm:p-6 shadow-sm rounded-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {job?.title || 'Job Details'}
            </h2>
          </div>
          <JopNav id={id} />
        </div>
        <div className="bg-white p-6 rounded shadow-sm m-5">
          <div className="text-center text-red-600 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
      {/* Header */}
      <div className="p-4 sm:p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 sm:p-6 shadow-sm rounded-md">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {job?.title || 'Loading...'}
          </h2>
        </div>
        <JopNav id={id} />
      </div>

      {/* Main Content - Styled like JopDetails */}
      <div className="bg-white p-6 rounded shadow-sm m-5">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Quiz Section</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading quizzes...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we fetch the available quizzes</p>
          </div>
        ) : quizzes.length > 0 ? (
          <>
            <div className="text-sm text-gray-600 mb-6">
              Test your knowledge with our available quizzes. Complete these quizzes to improve your application.
            </div>

            <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="w-full md:w-[48%]">
                  <QuizCard quiz={quiz} onStart={() => handleStart(quiz)} />
                </div>
              ))}
            </div>
          </>
                 ) : (
           <div className="text-center py-12">
             <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto border border-gray-200 shadow-sm">
               <svg 
                 className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                 fill="none" 
                 stroke="currentColor" 
                 viewBox="0 0 24 24"
               >
                 <path 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   strokeWidth={2} 
                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                 />
               </svg>
               <h3 className="text-lg font-semibold text-gray-700 mb-2">No Quiz Available</h3>
               <p className="text-gray-500 text-sm mb-3">
                 This job has no Quiz attached to it yet.
               </p>
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                 <p className="text-blue-700 text-xs">
                   💡 <strong>Tip:</strong> You can still apply for this job without taking a quiz. 
                   Some employers may add quizzes later or contact you directly for assessment.
                 </p>
               </div>
             </div>
           </div>
         )}
      </div>

      {/* Modal */}
      {showModal && selectedQuiz && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-40 flex justify-center items-center px-4">
          <QuizModal quiz={selectedQuiz} onClose={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
