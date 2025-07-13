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

export default function Level({ isOpen, onClose, trackId }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [trackData, setTrackData] = useState(null);
  const [levels, setLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Log props for debugging
  console.log('Level component props:', { isOpen, trackId, userId });

  // Fetch track data (for active session check)
  useEffect(() => {
    const fetchTrackData = async () => {
      if (!isOpen || !trackId) {
        console.log('Skipping fetchTrackData: isOpen or trackId missing', { isOpen, trackId });
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found in localStorage');
        console.log('Fetching track data for trackId:', trackId);
        const response = await axios.get(`http://fit4job.runasp.net/api/TrackAttempts/track/${trackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Raw fetched track data:', response.data);
        if (response.data && response.data.data && response.data.data.length > 0) {
          setTrackData(response.data.data[0]);
        } else {
          console.warn('No valid track data returned from API:', response.data);
          setTrackData(null);
        }
      } catch (error) {
        console.error('Error fetching track data:', error.response?.data || error.message);
        setError(`Failed to fetch track data: ${error.response?.data?.message || error.message}`);
        setTrackData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrackData();
  }, [isOpen, trackId]);

  // Fetch levels from the API
  useEffect(() => {
    const fetchLevels = async () => {
      if (!isOpen ) {
        console.log('Skipping fetchLevels: isOpen or categoryId missing', { isOpen });
        setError('Category ID is missing. Please select a valid category.');
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No auth token found in localStorage');
        console.log('Fetching levels for categoryId:', trackId);
        const response = await axios.get(`/api/Tracks/by-category/${trackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Raw fetched levels data:', response.data);
        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          const formattedLevels = response.data.data.map(level => ({
            levelName: level.name || 'Unnamed Level',
            description: level.description || 'No description available',
            difficultyBreakdown: [
              { difficulty: 'Easy', count: level.trackDetails?.easyQuestionsCounter || 0 },
              { difficulty: 'Medium', count: level.trackDetails?.mediumQuestionsCounter || 0 },
              { difficulty: 'Hard', count: level.trackDetails?.hardQuestionsCounter || 0 },
            ].filter(diff => diff.count >= 0),
            questionTypes: [
              { type: 'multiple choice', count: level.trackDetails?.multipleChoiceQuestionsCounter || 0 },
              { type: 'true false', count: level.trackDetails?.trueOrFalseQuestionsCounter || 0 },
              { type: 'written', count: level.trackDetails?.writtenQuestionsCounter || 0 },
            ].filter(qt => qt.count >= 0),
            duration: level.duration || '10 min',
            questionCount: level.trackQuestionsCount || 0,
            id: level.id, // Include id for openExamPage
          }));
          setLevels(formattedLevels);
          if (formattedLevels.length === 0) {
            setError('No levels found for this category.');
          }
        } else {
          console.warn('Invalid or empty levels data:', response.data);
          setError('No valid levels data returned from API.');
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
    fetchLevels();
  }, [isOpen]);

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
      const createResponse = await axios.post(
        '/api/TrackAttempts/create',
        { userId, trackId: selectedTrackId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Track attempt created:', createResponse.data);

      if (createResponse.data.success) {
        const fetchResponse = await axios.get(`/api/TrackAttempts/track/${selectedTrackId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched data from /api/TrackAttempts/track/{id}:', fetchResponse.data);
        if (fetchResponse.data && fetchResponse.data.data && fetchResponse.data.data.length > 0) {
          setTrackData(fetchResponse.data.data[0]);
        }
        navigate('/exam');
      } else {
        alert('Failed to start exam: ' + createResponse.data.message);
      }
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

  const isActiveSession = trackData && trackData.startTime && (trackData.endTime === null || trackData.endTime === undefined);
  console.log('isActiveSession:', isActiveSession, 'trackData:', trackData);

  if (!isOpen) {
    console.log('Level component not rendered: isOpen is false');
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col z-50 relative" onClick={(e) => e.stopPropagation()}>
      <div className="bg-gradient-to-r from-[#EEF2FF] to-[#EFF6FF] px-6 py-4 flex items-center justify-between rounded-t-2xl p-3">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Select Skill Level</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <img src={arrow} alt="arrow" className="w-4 h-4" />
            <span>React</span> {/* Replace with dynamic category name if available */}
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

        {isLoading ? (
          <p className="text-center text-gray-500">Loading levels...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : levels.length === 0 ? (
          <p className="text-center text-gray-500">No levels available for this category.</p>
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
                          <img src={questionTypeIcons[qt.type]} alt={qt.type} className="w-4 h-4 mb-3" />
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
                  className={`btn btn-sm rounded-full px-4 ${isActiveSession ? 'bg-green-500 hover:bg-green-600' : 'bg-[#1C79EA] hover:bg-[#2546EB]'} text-white`}
                  onClick={() => openExamPage(level.id)}
                  disabled={isLoading}
                >
                  {isActiveSession ? 'Continue Learning' : 'Start Level'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}