import React, { useEffect, useState } from 'react';
import alert from '../../assets/Images/alert.png';
import alerBlue from '../../assets/Images/alertBlue.png';
import right from '../../assets/Images/right.png';
import JopNav from '../../layouts/JopNav';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobDetails() {
  const { id } = useParams(); // Get jobId from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Retrieve userId and authToken from localStorage
  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  // Fetch job details
  useEffect(() => {
    setLoading(true);
    fetch(`http://fit4job.runasp.net/api/Jobs/${id}`, {
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${authToken || ''}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch job details.');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.data) {
          setJob(data.data);
        } else {
          throw new Error(data.message || 'Invalid job data.');
        }
      })
      .catch((err) => {
        setError('Error fetching job details: ' + err.message);
        console.error('Error fetching job:', err);
      })
      .finally(() => setLoading(false));
  }, [id, authToken]);

  // Check if user has already applied
  useEffect(() => {
    if (userId && id && authToken) {
      fetch(`http://fit4job.runasp.net/api/JobApplications?userId=${userId}&jobId=${id}`, {
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
          if (result.success && result.data && result.data.length > 0) {
            setHasApplied(true);
          }
        })
        .catch((err) => {
          console.error('Error checking application status:', err);
          // Don't set error state to avoid confusing users; silently fail
        });
    }
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

    console.log('Sending job application request:', JSON.stringify(requestBody, null, 2));

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
      console.log('API Response:', JSON.stringify(result, null, 2));

      if (response.ok && result.success) {
        setSuccess('Application submitted successfully!');
        setHasApplied(true);
      } else {
        setError(result.message || 'Failed to submit application.');
      }
    } catch (err) {
      setError('Network error: Could not submit application. ' + err.message);
      console.error('Error applying for job:', err);
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

  if (loading) {
    return <div className="p-10 text-center text-gray-600 text-lg">Loading...</div>;
  }

  if (error && !job) {
    return <div className="p-10 text-center text-red-600 text-lg">{error}</div>;
  }

  if (!job) {
    return <div className="p-10 text-center text-gray-600 text-lg">No job data available.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-5xl">
      {/* Header */}
      <div className="bg-gray-50 shadow-md rounded-lg overflow-hidden">
        <div className="bg-white p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">{job.title}</h2>
        </div>
        <JopNav id={id} />
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {error}
        </div>
      )}

      {/* Job Details */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Job Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Experience Needed:</span>
            <span className="text-gray-900">{job.yearsOfExperience || 'Not specified'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Career Level:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={alerBlue} alt="Career Level" className="w-4 h-4" />
              Experienced (Non-Manager)
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Education Level:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Education Level" className="w-4 h-4" />
              {educationLevels[job.educationLevel] || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Salary:</span>
            <span className="text-gray-900">{job.salaryRange || 'Confidential'}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Job Type:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Job Type" className="w-4 h-4" />
              {jobTypes[job.jobType] || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-32 sm:w-40 text-gray-600 font-medium">Work Location:</span>
            <span className="flex items-center gap-2 text-gray-900">
              <img src={right} alt="Work Location" className="w-4 h-4" />
              {workLocationTypes[job.workLocationType] || 'Not specified'}
            </span>
          </div>
        </div>

        {/* Skills and Tools */}
        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills And Tools</h3>
          <div className="flex flex-wrap gap-2">
            {(job.skills || ['Angular', 'Bootstrap', 'APIs', 'CSS', 'Design', 'Information Technology (IT)', 'JSON', 'JavaScript']).map(
              (skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                >
                  <img src={alert} alt={skill} className="w-4 h-4" />
                  {skill}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Job Description</h2>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Summary</h3>
        <p className="text-gray-700 whitespace-pre-line">{job.summary || 'No summary provided.'}</p>
      </div>

      {/* Job Requirements */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Job Requirements</h2>
        <p className="text-gray-700 whitespace-pre-line">{job.requirements || 'No requirements provided.'}</p>
      </div>

      {/* Apply Now Button */}
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