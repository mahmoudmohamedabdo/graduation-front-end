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
  const [hasApplied, setHasApplied] = useState(null); // null means not checked yet
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

  // استخدام endpoint isUserApplied للتحقق من حالة التقديم من الـ backend
  useEffect(() => {
    let isMounted = true;
    if (!authToken || !userId || !id) {
      if (isMounted) {
        setHasApplied(false);
      }
      return;
    }

    // التحقق السريع من localStorage أولاً (للتحميل السريع)
    const cachedApplicationId = localStorage.getItem(`applicationId_${id}`);
    if (cachedApplicationId) {
      console.log('Found cached application ID for job', id, ':', cachedApplicationId);
      setHasApplied(true);
      // لا نحتاج لانتظار الـ backend إذا كان لدينا cache صحيح
      setApplicationLoading(false);
      return; // نخرج مبكراً إذا كان لدينا cache
    }

    setApplicationLoading(true);
    fetch(`http://fit4job.runasp.net/api/JobApplications/isUserApplied?userId=${userId}&jobId=${id}`, {
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
        console.log('Backend isUserApplied response:', result); // Debug log
        if (isMounted) {
          // استخدام القيمة من الـ backend مباشرة
          const backendHasApplied = result?.success === true || (result?.data && result.data.id);
          
          console.log('Backend says user has applied:', backendHasApplied);
          setHasApplied(backendHasApplied);
          
          if (backendHasApplied && result.data?.id) {
            localStorage.setItem(`applicationId_${id}`, result.data.id);
            console.log('Application ID from backend for job', id, ':', result.data.id);
          } else {
            localStorage.removeItem(`applicationId_${id}`);
          }
        }
      })
      .catch((err) => {
        console.error('Error checking application status from backend:', err);
        if (isMounted) {
          // في حالة الخطأ، نعتمد على localStorage إذا كان موجوداً
          const cachedApplicationId = localStorage.getItem(`applicationId_${id}`);
          if (cachedApplicationId) {
            console.log('Using cached application status for job', id, 'due to backend error');
            setHasApplied(true);
          } else {
            setHasApplied(false);
            localStorage.removeItem(`applicationId_${id}`);
          }
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
    
    // Add a small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));

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
        setSuccess('Application submitted successfully! 🎉');
        setHasApplied(true);
        if (result.data?.id) {
          localStorage.setItem(`applicationId_${id}`, result.data.id);
          console.log("Application ID stored for job", id, ":", result.data.id);
        }
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
        
        // تحديث حالة التقديم من قاعدة البيانات بعد التقديم الناجح
        setTimeout(async () => {
          try {
            const checkResponse = await fetch(`http://fit4job.runasp.net/api/JobApplications/isUserApplied?userId=${userId}&jobId=${id}`, {
              headers: {
                accept: 'text/plain',
                Authorization: `Bearer ${authToken}`,
              },
            });
            if (checkResponse.ok) {
              const checkResult = await checkResponse.json();
              console.log('Post-application backend check:', checkResult);
              const backendHasApplied = checkResult?.success === true || (checkResult?.data && checkResult.data.id);
              setHasApplied(backendHasApplied);
              if (backendHasApplied && checkResult.data?.id) {
                localStorage.setItem(`applicationId_${id}`, checkResult.data.id);
              }
            }
          } catch (err) {
            console.error('Error updating application status from backend:', err);
          }
        }, 1000);
      } else {
        if (result.message === 'You have already applied for this job.') {
          // إذا قال الـ backend أن المستخدم قد تقدم بالفعل، نحدث الحالة
          setHasApplied(true);
          // نحفظ في localStorage حتى لو لم نحصل على applicationId
          localStorage.setItem(`applicationId_${id}`, 'applied');
          setError(result.message);
          console.log('Backend confirmed user has already applied for job', id);
        } else {
          setError(result.message || 'Failed to submit application.');
        }
      }
    } catch (err) {
      setError('Network error: Could not submit application. ' + err.message);
      // لا نغير hasApplied هنا لأننا نريد الاحتفاظ بالقيمة من الـ backend
      console.error('Network error during application for job', id, ':', err);
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

  // عرض شاشة تحميل فقط عند تحميل بيانات الوظيفة أو عند عدم وجود بيانات
  if (loading || !job) {
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
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg flex items-center gap-2 shadow-sm animate-pulse">
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-600 hover:text-green-800"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg flex items-center gap-2 shadow-sm">
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
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
        <div className="relative">
                  <button
          className={`py-3 px-8 rounded-full text-white font-medium shadow-lg transition-all duration-300 ${
            loading 
              ? 'bg-blue-500 cursor-not-allowed opacity-75 animate-pulse' // Blue during loading with pulse
              : hasApplied === true
              ? 'bg-gray-500 cursor-not-allowed opacity-90 shadow-md' // Gray when already applied (from backend)
              : applicationLoading || hasApplied === null
              ? 'bg-gray-400 cursor-not-allowed opacity-75' // Gray when checking status
              : 'bg-green-600 hover:bg-green-700 hover:shadow-xl transform hover:scale-105 active:scale-95'
          }`}
          onClick={handleApplyNow}
          disabled={loading || hasApplied === true || applicationLoading || hasApplied === null}
          title={
            loading ? 'Submitting application...' 
            : hasApplied === true ? 'You have already applied for this job (confirmed by backend)'
            : applicationLoading || hasApplied === null ? 'Checking application status...'
            : 'Click to apply for this job'
          }
        >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-semibold">Applying...</span>
              </span>
                      ) : hasApplied === true ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Already Applied</span>
            </span>
                      ) : applicationLoading || hasApplied === null ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-semibold">Checking...</span>
            </span>
                    ) : (
            <span className="font-semibold">Apply Now</span>
          )}
          </button>
          {hasApplied && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              ✓ Already applied
            </div>
          )}
        </div>
      </div>
    </div>
  );
}