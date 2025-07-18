import React, { useState, useEffect } from 'react';
import arrow from '../../assets/Images/arrow.png';
import exit from '../../assets/Images/Exit.png';
import stars from '../../assets/Images/stars.png';
import choice from '../../assets/Images/choice.png';
import mc from '../../assets/Images/true.png';
import code from '../../assets/Images/code.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Map question type 
const questionTypeIcons = {
  'multiple choice': choice,
  'true false': mc,
  'written': code,
};

// Map difficulty 
const difficultyColors = {
  Easy: { bg: 'bg-[#DCFCE7]', text: 'text-[#15803D]' },
  Medium: { bg: 'bg-[#FEF9C3]', text: 'text-[#A16207]' },
  Hard: { bg: 'bg-[#FEE2E2]', text: 'text-[#B91C1C]' },
};

export default function Level({ isOpen, onClose, trackId, categoryId }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [levels, setLevels] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  
  console.log('Level component props:', { isOpen, trackId, userId });

  // جلب المستويات وبيانات المحاولات
  useEffect(() => {
    const fetchLevelsAndAttempts = async () => {
      if (!isOpen || !trackId || !userId) {
        console.log('Skipping fetchLevels: missing isOpen, trackId, or userId', { isOpen, trackId, userId });
        setError('Missing required data. Please ensure you are logged in and have selected a valid track.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found in localStorage');

        // جلب بيانات المسار (track) كـ level واحد من by-category
        console.log('Fetching track as level for trackId:', trackId, 'and categoryId:', categoryId);
        const response = await axios.get(`http://fit4job.runasp.net/api/Tracks/by-category/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Raw fetched track data:', response.data);

        const tracks = Array.isArray(response.data.data) ? response.data.data : [];
        const level = tracks.find(t => t.id === Number(trackId));
        if (level) {
          console.log('LEVEL DATA:', level);
          console.log('trackDetails:', level?.trackDetails);
          // معالجة trackDetails سواء كانت مصفوفة أو كائن
          let details = level?.trackDetails;
          if (Array.isArray(details)) {
            details = details[0] || {};
          } else if (!details) {
            details = {};
          }
          const formattedLevel = {
            levelName: level?.name || 'Unnamed Level',
            description: level?.description || 'No description available',
            difficultyBreakdown: [
              { difficulty: 'Easy', count: details.easyQuestionsCounter ?? 0 },
              { difficulty: 'Medium', count: details.mediumQuestionsCounter ?? 0 },
              { difficulty: 'Hard', count: details.hardQuestionsCounter ?? 0 },
            ],
            questionTypes: [
              { type: 'multiple choice', count: details.multipleChoiceQuestionsCounter ?? 0 },
              { type: 'true false', count: details.trueOrFalseQuestionsCounter ?? 0 },
              { type: 'written', count: details.writtenQuestionsCounter ?? 0 },
            ],
            duration: level?.duration || '10 min',
            questionCount: level?.trackQuestionsCount ?? 0,
            id: level?.id,
          };
          setLevels([formattedLevel]);

          // جلب بيانات المحاولة
          const attemptsData = {};
          try {
            const attemptId = localStorage.getItem(`attemptId_${level?.id}`);
            if (attemptId) {
              const attemptResponse = await axios.get(
                `http://fit4job.runasp.net/api/TrackAttempts/${attemptId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              console.log(`Attempt data for track ${level?.id}:`, attemptResponse.data);
              if (attemptResponse.data.success && attemptResponse.data.data) {
                attemptsData[level?.id] = attemptResponse.data.data;
              } else {
                attemptsData[level?.id] = null;
              }
            } else {
              attemptsData[level?.id] = null;
            }
          } catch (err) {
            console.warn(`No attempt found for track ${level?.id}:`, err.response?.data || err.message);
            attemptsData[level?.id] = null; 
          }
          setAttempts(attemptsData);
        } else {
          console.warn('Invalid or empty track data:', response.data);
          setError('No valid level data returned from API.');
          setLevels([]);
        }
      } catch (error) {
        console.error('Error fetching levels:', error.response?.data || error.message);
        setError(`Failed to fetch levels: ${error.response?.data?.message || error.message}`);
        setLevels([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevelsAndAttempts();
  }, [isOpen, trackId, userId]);

  const openExamPage = async (selectedTrackId) => {
    const token = localStorage.getItem('authToken');
    if (!userId || !token) {
      alert('Please log in to start the exam.');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // إنشاء محاولة جديدة فقط إذا لم تكن هناك محاولة قائمة أو إذا كانت مكتملة
      if (!attempts[selectedTrackId] || attempts[selectedTrackId].endTime) {
        console.log(`Creating new attempt for track ${selectedTrackId}`);
        const response = await axios.post(
          'http://fit4job.runasp.net/api/TrackAttempts/create',
          { userId, trackId: selectedTrackId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Attempt creation response:', response.data);
        // تحديث حالة المحاولات
        setAttempts(prev => ({
          ...prev,
          [selectedTrackId]: response.data.data,
        }));
        // تخزين attemptId في localStorage
        localStorage.setItem(`attemptId_${selectedTrackId}`, response.data.data.id);
      }

      console.log(`Navigating to /exam/${selectedTrackId}`);
      navigate(`/exam/${selectedTrackId}`);
    } catch (error) {
      console.error('Error starting exam:', error.response?.data || error.message);
      setError(`Failed to start exam: ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 401) {
        alert('You are not authorized. Please log in again.');
        navigate('/login');
      } else {
        alert('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // تحديد نص الزر بناءً على حالة المحاولة
  const getButtonText = (trackId) => {
    const attempt = attempts[trackId];
    console.log(`getButtonText for track ${trackId}:`, { attempt });
    if (attempt) {
      if (attempt.endTime || attempt.progressPercentage === 100) {
        return 'Completed';
      }
      return 'Continue Course';
    }
    return 'Start Course';
  };

  if (!isOpen) {
    console.log('Level component not rendered: isOpen is false');
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col z-50 relative" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-r from-[#EEF2FF] to-[#EFF6FF] px-6 py-4 flex items-center justify-between rounded-t-2xl p-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Select Course</h2>
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
          Choose Course You Want To Practice
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading levels...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : levels.length === 0 ? (
          <p className="text-center text-gray-500">No levels available for this track.</p>
        ) : (
          levels.map((level, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{level.levelName}</span>
                <img src={stars} alt="stars" className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-500">{level.description}</p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2">Difficulty Breakdown</h4>
                  {level.difficultyBreakdown.length > 0 ? (
                    level.difficultyBreakdown.map((diff, i) => (
                      <div key={i} className="flex justify-between text-sm mb-1">
                        <span className={`${difficultyColors[diff.difficulty].bg} ${difficultyColors[diff.difficulty].text} px-2 py-1 rounded-full`}>
                          {diff.difficulty}
                        </span>
                        <span>{diff.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No difficulty breakdown available</p>
                  )}
                </div>
                <div className="flex-1 bg-white p-4 rounded-lg border">
                  <h4 className="text-sm font-semibold mb-2">Question Types</h4>
                  {level.questionTypes.length > 0 ? (
                    level.questionTypes.map((qt, i) => (
                      <div key={i} className="flex justify-between items-center text-sm mb-1">
                        <div className="flex items-center gap-2">
                          <img src={questionTypeIcons[qt.type]} alt={qt.type} className="w-4 h-4" />
                          <p>{qt.type}</p>
                        </div>
                        <span>{qt.count}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No question types available</p>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span>🕒 {level.duration}</span>
                  <span className="text-[#1C79EA] cursor-pointer">{level.questionCount} questions</span>
                </div>
                <button
                  className={`btn btn-sm rounded-full px-4 text-white ${
                    attempts[level.id] && (attempts[level.id].endTime || attempts[level.id].progressPercentage === 100)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#1C79EA] hover:bg-[#2546EB]'
                  }`}
                  onClick={() => openExamPage(level.id)}
                  disabled={isLoading || (attempts[level.id] && (attempts[level.id].endTime || attempts[level.id].progressPercentage === 100))}
                >
                  {getButtonText(level.id)}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}