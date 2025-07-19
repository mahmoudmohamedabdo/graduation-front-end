import React, { useEffect, useState } from 'react';
import alert from '../../assets/Images/alert.png';
import alerBlue from '../../assets/Images/alertBlue.png';
import right from '../../assets/Images/right.png';
import JopNav from '../../layouts/JopNav';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasApplied, setHasApplied] = useState(() => localStorage.getItem('applicationId') ? true : false);
  const [applicationId, setApplicationId] = useState(() => localStorage.getItem('applicationId') || null);
  const [applicationLoading, setApplicationLoading] = useState(false);

  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    let isMounted = true;
    if (!authToken || !userId) {
      if (isMounted) {
        setError('Please log in to view job details.');
        navigate('/login');
      }
      return;
    }

    setLoading(true);
    fetch(`http://fit4job.runasp.net/api/Jobs/${id}`, {
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch job details.');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data?.success && data.data) {
          setJob(data.data);
        } else {
          throw new Error(data?.message || 'Invalid job data.');
        }
      })
      .catch((err) => {
        if (isMounted) setError('Error fetching job details: ' + err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id, authToken, navigate, userId]);

  useEffect(() => {
    let isMounted = true;
    if (!authToken || !userId || !id) {
      if (isMounted) {
        setHasApplied(false);
        setApplicationId(null);
        localStorage.removeItem('applicationId');
      }
      return;
    }

    setApplicationLoading(true);
    fetch(`http://fit4job.runasp.net/api/JobApplications/job/${id}/user/${userId}`, {
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to check application status.');
        return res.json();
      })
      .then((result) => {
        console.log('Application status response:', result); // Debug log
        if (isMounted && result?.success && result.data && Array.isArray(result.data)) {
          const currentApplication = result.data.find(
            (application) => application.jobId === parseInt(id) && application.userId === parseInt(userId)
          );
          if (currentApplication) {
            if (isMounted) {
              setHasApplied(true);
              setApplicationId(currentApplication.id);
              localStorage.setItem('applicationId', currentApplication.id);
            }
          } else {
            if (isMounted) {
              setHasApplied(false);
              setApplicationId(null);
              localStorage.removeItem('applicationId');
            }
          }
        } else {
          if (isMounted) {
            setHasApplied(false);
            setApplicationId(null);
            localStorage.removeItem('applicationId');
          }
        }
      })
      .catch((err) => {
        console.error('Error checking application status:', err);
        if (isMounted) {
          setHasApplied(false);
          setApplicationId(null);
          localStorage.removeItem('applicationId');
        }
      })
      .finally(() => {
        if (isMounted) setApplicationLoading(false);
      });

    return () => { isMounted = false; };
  }, [userId, id, authToken]);

  const handleApplyNow = async () => {
    if (!userId || userId === '0' || !authToken) {
      setError('Please log in to apply for this job.');
      navigate('/login');
      return;
    }

    if (!id || id === '0') {
      setError('Invalid job ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const requestBody = {
      userId: parseInt(userId),
      jobId: parseInt(id),
      examAttemptId: 0,
      taskSubmissionId: 0,
      status: 0,
      appliedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('http://fit4job.runasp.net/api/JobApplications', {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();
      console.log('Apply response:', result); // Debug log

      if (response.ok && result?.success) {
        setSuccess('Application submitted successfully!');
        setHasApplied(true);
        if (result.data?.id) {
          setApplicationId(result.data.id);
          localStorage.setItem('applicationId', result.data.id);
          console.log("Application ID stored:", result.data.id);
        }
      } else {
        if (result.message === 'You have already applied for this job.') {
          setHasApplied(true); // Ensure hasApplied is set to true on this error
          setApplicationId(localStorage.getItem('applicationId') || null);
          setError(result.message); // Show the error but keep the button disabled
        } else {
          setError(result.message || 'Failed to submit application.');
        }
      }
    } catch (err) {
      setError('Network error: Could not submit application. ' + err.message);
      setHasApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const educationLevels = {
    1: 'PhD',
    2: 'Master’s Degree',
    3: 'Bachelor’s Degree',
    4: 'Associate Degree',
    5: 'High School',
  };

  const jobTypes = {
    1: 'Freelance',
    2: 'Part-Time',
    3: 'Internship',
    4: 'Full-Time',
  };

  const workLocationTypes = {
    1: 'Remote',
    2: 'Hybrid',
    3: 'On-site',
  };

  if (loading || (applicationLoading && !hasApplied)) {
    return <div className="p-10 text-center text-gray-600 text-lg">Loading...</div>;
  }

  if (error && !job) {
    return <div className="p-10 text-center text-red-600 text-lg">{error}</div>;
  }

  if (!job) {
    return <div className="p-10 text-center text-gray-600 text-lg">No job data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 ">
      {/* Header */}
      <div className="p-6 bg-gray-50 shadow-md">
        <div className="bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">{job.title || 'Loading...'}</h2>
        </div>
        <JopNav id={id} />
      </div>
      {/* Success/Error Messages */}
      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          ❌ {error}
        </div>
      )}

      {/* Job Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Experience Needed:</span>
            <span className="text-gray-900">{job.yearsOfExperience || 'Not specified'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Career Level:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={alerBlue} alt="Career Level" className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
              Experienced (Non-Manager)
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Education Level:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Education Level" className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
              {educationLevels[job.educationLevel] || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Salary:</span>
            <span className="text-gray-900">{job.salaryRange || 'Confidential'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Job Type:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Job Type" className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
              {jobTypes[job.jobType] || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-40 text-gray-600 font-medium">Work Location:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Work Location" className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
              {workLocationTypes[job.workLocationType] || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills And Tools</h3>
          <div className="flex flex-wrap gap-2">
            {(job.skills || []).map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                <img src={alert} alt={skill} className="w-4 h-4" onError={(e) => { e.target.style.display = 'none'; }} />
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.summary || 'No summary provided.'}</p>
      </div>

      {/* Requirements */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Job Requirements</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.requirements || 'No requirements provided.'}</p>
      </div>

      {/* Apply Button */}
      <div className="flex justify-end mt-6 mb-10">
        <button
          className={`py-3 px-8 rounded-full text-white font-medium shadow-lg transition duration-300 ${
            loading || hasApplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={handleApplyNow}
          disabled={loading || hasApplied}
        >
          {loading ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}