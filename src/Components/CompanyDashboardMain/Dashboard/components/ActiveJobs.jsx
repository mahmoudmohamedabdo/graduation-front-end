import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, FileText, Clock, Calendar, ChevronDown, ChevronUp, Users, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditTaskModal from '../../EditTaskModal';

export default function ActiveJobs({ refreshKey, refreshJobs }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(null);
  const [submissionsDropdownOpen, setSubmissionsDropdownOpen] = useState(null);
  const [applicationsDropdownOpen, setApplicationsDropdownOpen] = useState(null);
  const [taskSubmissions, setTaskSubmissions] = useState({});
  const [jobApplications, setJobApplications] = useState({});
  const [isSubmissionsLoading, setIsSubmissionsLoading] = useState({});
  const [isApplicationsLoading, setIsApplicationsLoading] = useState({});
  const [submissionError, setSubmissionError] = useState({});
  const [applicationError, setApplicationError] = useState({});
  const [editTaskData, setEditTaskData] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState({});
  const [expandedApplications, setExpandedApplications] = useState({});
  const dropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);
  const submissionsDropdownRef = useRef(null);
  const applicationsDropdownRef = useRef(null);

  const jobTypeMap = {
    1: 'Freelance',
    2: 'Part-Time',
    3: 'Internship',
    4: 'Full-Time',
  };

  const locationTypeMap = {
    1: 'Remote',
    2: 'Hybrid',
    3: 'Onsite',
  };

  const educationLevelMap = {
    1: 'PhD',
    2: 'Master’s Degree',
    3: "Bachelor's Degree",
    4: 'Associate Degree',
    5: 'High School',
  };

  const statusMap = {
    0: 'Pending',
    1: 'Accepted',
    2: 'Rejected',
    3: 'Under Review',
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        taskDropdownRef.current &&
        !taskDropdownRef.current.contains(event.target) &&
        submissionsDropdownRef.current &&
        !submissionsDropdownRef.current.contains(event.target) &&
        applicationsDropdownRef.current &&
        !applicationsDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
        setTaskDropdownOpen(null);
        setSubmissionsDropdownOpen(null);
        setApplicationsDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      const authToken = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      const profileId = localStorage.getItem('profileId');

      if (!authToken || !['Employer', 'Company'].includes(userRole)) {
        if (isMounted) {
          setError('You must be logged in as an Employer to view active jobs');
          navigate('/login');
        }
        return;
      }

      if (!profileId) {
        if (isMounted) {
          setError('Company ID is missing. Please log in again or contact support.');
          navigate('/login');
        }
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://fit4job.runasp.net/api/Jobs/Company/${profileId}?t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        );

        if (response.data.success && Array.isArray(response.data.data)) {
          const filteredJobs = response.data.data.filter(
            (job) => String(job.companyId) === String(profileId)
          );
          const jobsWithTasksAndApps = await Promise.all(
            filteredJobs.map(async (job) => {
              let task = null;
              let hasTasks = false;
              let applications = [];

              // Fetch task data
              try {
                const taskResponse = await axios.get(
                  `http://fit4job.runasp.net/api/CompanyTasks/job/${job.id}?t=${Date.now()}`,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                    },
                  }
                );

                if (taskResponse.data.success && taskResponse.data.data) {
                  task = taskResponse.data.data;
                  hasTasks = true;
                  const taskValidation = await axios.get(
                    `http://fit4job.runasp.net/api/CompanyTasks/${task.id}?t=${Date.now()}`,
                    {
                      headers: {
                        Authorization: `Bearer ${authToken}`,
                        Accept: 'application/json',
                      },
                    }
                  );
                  if (!taskValidation.data.success) {
                    console.warn(`Invalid taskId ${task.id} for job ${job.id}`);
                    task = null;
                    hasTasks = false;
                  }
                }
              } catch (err) {
                console.error(`Error fetching task for job ${job.id}:`, {
                  message: err.message,
                  response: err.response ? err.response.data : null,
                });
              }

              // Fetch applications data
              try {
                const appResponse = await axios.get(
                  `http://fit4job.runasp.net/api/JobApplications/job/${job.id}?t=${Date.now()}`,
                  {
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      Accept: 'text/plain',
                    },
                  }
                );
                if (appResponse.data.success) {
                  applications = Array.isArray(appResponse.data.data)
                    ? appResponse.data.data
                    : appResponse.data.data
                    ? [appResponse.data.data]
                    : [];
                }
              } catch (err) {
                console.error(`Error fetching applications for job ${job.id}:`, {
                  message: err.message,
                  response: err.response ? err.response.data : null,
                });
              }

              return {
                ...job,
                hasTasks,
                task,
                applications,
              };
            })
          );

          if (isMounted) {
            setJobs(jobsWithTasksAndApps);
          }
        } else {
          throw new Error(response.data.message || 'No jobs found');
        }
      } catch (err) {
        if (isMounted) {
          setError(`Failed to fetch jobs: ${err.message}`);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [navigate, refreshKey]);

  const fetchTaskSubmissions = async (jobId) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('Authentication token is missing. Please log in again.');
      navigate('/login');
      return;
    }

    const job = jobs.find((j) => j.id === jobId);
    if (!job || !job.hasTasks || !job.task) {
      setSubmissionError((prev) => ({
        ...prev,
        [jobId]: 'No task associated with this job.',
      }));
      setIsSubmissionsLoading((prev) => ({ ...prev, [jobId]: false }));
      return;
    }

    const taskId = parseInt(job.task.id);
    setIsSubmissionsLoading((prev) => ({ ...prev, [jobId]: true }));
    setSubmissionError((prev) => ({ ...prev, [jobId]: null }));

    try {
      const taskValidation = await axios.get(
        `http://fit4job.runasp.net/api/CompanyTasks/${taskId}?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        }
      );
      if (!taskValidation.data.success) {
        throw new Error(`Task ${taskId} does not exist.`);
      }

      const response = await axios.get(
        `http://fit4job.runasp.net/api/TaskSubmissions/${taskId}?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (response.data.success) {
        const submissions = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : [];
        setTaskSubmissions((prev) => ({
          ...prev,
          [jobId]: submissions,
        }));
        if (submissions.length === 0) {
          setSubmissionError((prev) => ({
            ...prev,
            [jobId]: 'No submissions found for this task.',
          }));
        }
      } else {
        setSubmissionError((prev) => ({
          ...prev,
          [jobId]: response.data.message || 'No submissions found.',
        }));
        setTaskSubmissions((prev) => ({ ...prev, [jobId]: [] }));
      }
    } catch (err) {
      let errorMessage = err.response?.data?.message || `Failed to fetch submissions: ${err.message}`;
      if (err.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again or check your permissions.';
        navigate('/login');
      }
      setSubmissionError((prev) => ({
        ...prev,
        [jobId]: errorMessage,
      }));
      setTaskSubmissions((prev) => ({ ...prev, [jobId]: [] }));
    } finally {
      setIsSubmissionsLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const fetchJobApplications = async (jobId) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      setError('Authentication token is missing. Please log in again.');
      navigate('/login');
      return;
    }

    setIsApplicationsLoading((prev) => ({ ...prev, [jobId]: true }));
    setApplicationError((prev) => ({ ...prev, [jobId]: null }));

    try {
      const response = await axios.get(
        `http://fit4job.runasp.net/api/JobApplications/job/${jobId}?t=${Date.now()}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: 'text/plain',
          },
        }
      );

      if (response.data.success) {
        const applications = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : [];
        setJobApplications((prev) => ({
          ...prev,
          [jobId]: applications,
        }));
        if (applications.length === 0) {
          setApplicationError((prev) => ({
            ...prev,
            [jobId]: 'No applications found for this job.',
          }));
        }
      } else {
        setApplicationError((prev) => ({
          ...prev,
          [jobId]: response.data.message || 'No applications found.',
        }));
        setJobApplications((prev) => ({ ...prev, [jobId]: [] }));
      }
    } catch (err) {
      let errorMessage = err.response?.data?.message || `Failed to fetch applications: ${err.message}`;
      if (err.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again or check your permissions.';
        navigate('/login');
      }
      setApplicationError((prev) => ({
        ...prev,
        [jobId]: errorMessage,
      }));
      setJobApplications((prev) => ({ ...prev, [jobId]: [] }));
    } finally {
      setIsApplicationsLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const handleAddNew = () => navigate('/job-quiz/0');

  const handleEdit = (jobId) => {
    navigate(`/job-quiz/${jobId}`);
    setDropdownOpen(null);
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;

    const authToken = localStorage.getItem('authToken');
    try {
      await axios.delete(`http://fit4job.runasp.net/api/Jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      setJobs(jobs.filter((job) => job.id !== jobId));
      if (refreshJobs) refreshJobs();
    } catch (err) {
      setError(`Failed to delete job: ${err.message}`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleEditTask = (jobId, taskId) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job && job.task) {
      setEditTaskData({ jobId, task: job.task });
    }
    setTaskDropdownOpen(null);
  };

  const toggleDropdown = (jobId) => {
    setDropdownOpen(dropdownOpen === jobId ? null : jobId);
    setTaskDropdownOpen(null);
    setSubmissionsDropdownOpen(null);
    setApplicationsDropdownOpen(null);
  };

  const toggleTaskDropdown = (jobId) => {
    setTaskDropdownOpen(taskDropdownOpen === jobId ? null : jobId);
    setDropdownOpen(null);
    setSubmissionsDropdownOpen(null);
    setApplicationsDropdownOpen(null);
  };

  const toggleSubmissionsDropdown = (jobId) => {
    if (submissionsDropdownOpen !== jobId) {
      fetchTaskSubmissions(jobId);
    }
    setSubmissionsDropdownOpen(submissionsDropdownOpen === jobId ? null : jobId);
    setDropdownOpen(null);
    setTaskDropdownOpen(null);
    setApplicationsDropdownOpen(null);
  };

  const toggleApplicationsDropdown = (jobId) => {
    if (applicationsDropdownOpen !== jobId) {
      fetchJobApplications(jobId);
    }
    setApplicationsDropdownOpen(applicationsDropdownOpen === jobId ? null : jobId);
    setDropdownOpen(null);
    setTaskDropdownOpen(null);
    setSubmissionsDropdownOpen(null);
  };

  const toggleTaskDetails = (jobId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const toggleApplicationsDetails = (jobId) => {
    setExpandedApplications((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const handleTaskModalClose = () => setEditTaskData(null);

  const handleTaskModalSave = async (updatedTask) => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axios.put(
        `http://fit4job.runasp.net/api/CompanyTasks/${updatedTask.id}`,
        updatedTask,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editTaskData.jobId
            ? { ...job, task: updatedTask, hasTasks: true }
            : job
        )
      );
      alert('Task edited successfully!');
      setEditTaskData(null);
      if (refreshJobs) refreshJobs();
    } catch (err) {
      alert(`Failed to edit task: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Active Jobs</h2>
          <button
            onClick={handleAddNew}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span className="mr-2">+</span> Post New Job
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading jobs...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        )}
        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600 text-lg">
              No active jobs found.{' '}
              <button onClick={handleAddNew} className="text-blue-600 hover:underline font-semibold">
                Post a new job
              </button>
              .
            </p>
          </div>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{job.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {jobTypeMap[job.jobType] || 'Unknown Job Type'}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {locationTypeMap[job.workLocationType] || 'Unknown Location'}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {educationLevelMap[job.educationLevel] || 'Education not specified'}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded-md">
                        {job.salaryRange || 'Salary not specified'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 relative">
                    {job.hasTasks ? (
                      <button
                        className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs hover:bg-green-200 transition-colors duration-200"
                        onClick={() => toggleTaskDropdown(job.id)}
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Task
                      </button>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                        No Task
                      </span>
                    )}
                    <button
                      className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs hover:bg-yellow-200 transition-colors duration-200"
                      onClick={() => toggleSubmissionsDropdown(job.id)}
                    >
                      <FileCheck className="w-4 h-4 mr-1" />
                      Submissions
                      {taskSubmissions[job.id]?.length > 0 && (
                        <span className="ml-2 bg-yellow-500 text-white text-xs rounded-full px-2 py-0.5">
                          {taskSubmissions[job.id].length}
                        </span>
                      )}
                    </button>
                    <button
                      className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs hover:bg-purple-200 transition-colors duration-200"
                      onClick={() => toggleApplicationsDropdown(job.id)}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      Applications
                      {jobApplications[job.id]?.length > 0 && (
                        <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                          {jobApplications[job.id].length}
                        </span>
                      )}
                    </button>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      Active
                    </span>
                    <button
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      onClick={() => toggleDropdown(job.id)}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {dropdownOpen === job.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 transition-all duration-200 ease-in-out"
                      >
                        <button
                          onClick={() => handleEdit(job.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Edit Job
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Delete Job
                        </button>
                      </div>
                    )}
                    {taskDropdownOpen === job.id && job.hasTasks && job.task && (
                      <div
                        ref={taskDropdownRef}
                        className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 transition-all duration-200 ease-in-out"
                      >
                        <button
                          onClick={() => handleEditTask(job.id, job.task.id)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          Edit Task: {job.task.title}
                        </button>
                      </div>
                    )}
                    {submissionsDropdownOpen === job.id && (
                      <div
                        ref={submissionsDropdownRef}
                        className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-72 max-h-96 overflow-y-auto transition-all duration-200 ease-in-out"
                      >
                        {isSubmissionsLoading[job.id] ? (
                          <div className="px-4 py-3 text-sm text-gray-600 flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                            Loading submissions...
                          </div>
                        ) : submissionError[job.id] ? (
                          <div className="px-4 py-3">
                            <p className="text-sm text-red-600">{submissionError[job.id]}</p>
                            <button
                              className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                              onClick={() => fetchTaskSubmissions(job.id)}
                            >
                              Retry
                            </button>
                          </div>
                        ) : taskSubmissions[job.id]?.length > 0 ? (
                          taskSubmissions[job.id].map((submission) => (
                            <div
                              key={submission.id}
                              className="px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <p className="font-medium">Submission ID: {submission.id}</p>
                              <p>User ID: {submission.userId}</p>
                              <p>
                                Submitted:{' '}
                                {new Date(submission.submittedAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                              {submission.submissionNotes && (
                                <p className="mt-1">
                                  <span className="font-medium">Notes:</span>{' '}
                                  {submission.submissionNotes}
                                </p>
                              )}
                              {submission.submissionLink && (
                                <p className="mt-1">
                                  <a
                                    href={submission.submissionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    <FileCheck className="w-4 h-4 mr-1" />
                                    View Submission
                                  </a>
                                </p>
                              )}
                              {submission.demoLink && (
                                <p className="mt-1">
                                  <a
                                    href={submission.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center"
                                  >
                                    <FileCheck className="w-4 h-4 mr-1" />
                                    View Demo
                                  </a>
                                </p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3">
                            <p className="text-sm text-gray-600">No submissions found</p>
                            <button
                              className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                              onClick={() => fetchTaskSubmissions(job.id)}
                            >
                              Refresh
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {applicationsDropdownOpen === job.id && (
                      <div
                        ref={applicationsDropdownRef}
                        className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-72 max-h-96 overflow-y-auto transition-all duration-200 ease-in-out"
                      >
                        {isApplicationsLoading[job.id] ? (
                          <div className="px-4 py-3 text-sm text-gray-600 flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600 mr-2"></div>
                            Loading applications...
                          </div>
                        ) : applicationError[job.id] ? (
                          <div className="px-4 py-3">
                            <p className="text-sm text-red-600">{applicationError[job.id]}</p>
                            <button
                              className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                              onClick={() => fetchJobApplications(job.id)}
                            >
                              Retry
                            </button>
                          </div>
                        ) : jobApplications[job.id]?.length > 0 ? (
                          jobApplications[job.id].map((application) => (
                            <div
                              key={application.id}
                              className="px-4 py-3 text-sm text-gray-700 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <p className="font-medium">Application ID: {application.id}</p>
                              <p>User ID: {application.userId}</p>
                              <p>
                                Applied:{' '}
                                {new Date(application.appliedAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                              <p>
                                Status:{' '}
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                                    application.status === 1
                                      ? 'bg-green-100 text-green-700'
                                      : application.status === 2
                                      ? 'bg-red-100 text-red-700'
                                      : application.status === 3
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {statusMap[application.status] || 'Unknown'}
                                </span>
                              </p>
                              {application.examAttemptId !== 0 && (
                                <p>Exam Attempt ID: {application.examAttemptId}</p>
                              )}
                              {application.taskSubmissionId !== 0 && (
                                <p>Task Submission ID: {application.taskSubmissionId}</p>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3">
                            <p className="text-sm text-gray-600">No applications found</p>
                            <button
                              className="mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200"
                              onClick={() => fetchJobApplications(job.id)}
                            >
                              Refresh
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {job.hasTasks && job.task && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleTaskDetails(job.id)}
                      className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
                    >
                      {expandedTasks[job.id] ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide Task Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show Task Details
                        </>
                      )}
                    </button>
                    {expandedTasks[job.id] && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm transition-all duration-200">
                        <h5 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-blue-600" />
                          Task: {job.task.title}
                        </h5>
                        <div className="space-y-3 text-sm text-gray-700">
                          <div className="flex items-start">
                            <span className="font-medium w-28">Description:</span>
                            <p className="flex-1">{job.task.description || 'No description provided'}</p>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium w-28">Deadline:</span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                              {new Date(job.task.deadline).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium w-28">Est. Hours:</span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1 text-gray-500" />
                              {job.task.estimatedHours || 'Not specified'}
                            </span>
                          </div>
                          {job.task.requirements && (
                            <div className="flex items-start">
                              <span className="font-medium w-28">Requirements:</span>
                              <ul className="list-disc list-inside flex-1">
                                {job.task.requirements.split('\n').map((req, idx) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {job.task.deliverables && (
                            <div className="flex items-start">
                              <span className="font-medium w-28">Deliverables:</span>
                              <p className="flex-1">{job.task.deliverables}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {job.applications && job.applications.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={() => toggleApplicationsDetails(job.id)}
                      className="flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm transition-colors duration-200"
                    >
                      {expandedApplications[job.id] ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-1" />
                          Hide Applications
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Show Applications
                        </>
                      )}
                    </button>
                    {expandedApplications[job.id] && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm transition-all duration-200">
                        <h5 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-purple-600" />
                          Applications
                        </h5>
                        {job.applications.map((application, index) => (
                          <div
                            key={index}
                            className="space-y-2 text-sm text-gray-700 border-b pb-2 mb-2 last:border-b-0 last:pb-0"
                          >
                            <p className="font-medium">Application ID: {application.id}</p>
                            <p>User ID: {application.userId}</p>
                            <p>
                              Applied:{' '}
                              {new Date(application.appliedAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                            <p>
                              Status:{' '}
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  application.status === 1
                                    ? 'bg-green-100 text-green-700'
                                    : application.status === 2
                                    ? 'bg-red-100 text-red-700'
                                    : application.status === 3
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {statusMap[application.status] || 'Unknown'}
                              </span>
                            </p>
                            {application.examAttemptId !== 0 && (
                              <p>Exam Attempt ID: {application.examAttemptId}</p>
                            )}
                            {application.taskSubmissionId !== 0 && (
                              <p>Task Submission ID: {application.taskSubmissionId}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {editTaskData && (
        <EditTaskModal
          task={editTaskData.task}
          onClose={handleTaskModalClose}
          onSave={handleTaskModalSave}
        />
      )}
    </div>
  );
}