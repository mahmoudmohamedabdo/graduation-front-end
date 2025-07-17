import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ActiveJobs({ refreshKey, refreshJobs }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const taskDropdownRef = useRef(null);

  const jobTypeMap = {
    1: "Freelance",
    2: "Part-Time",
    3: "Internship",
    4: "Full-Time",
  };

  const locationTypeMap = {
    1: "Remote",
    2: "Hybrid",
    3: "Onsite",
  };

  const educationLevelMap = {
    1: "PhD",
    2: "Master’s Degree",
    3: "Bachelor's Degree",
    4: "Associate Degree",
    5: "High School",
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        taskDropdownRef.current &&
        !taskDropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(null);
        setTaskDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Function to fetch tasks with retry mechanism
  const fetchTasksForJob = async (jobId, authToken, retries = 3, delay = 2000) => {
    const taskEndpoint = `http://fit4job.runasp.net/api/CompanyTasks/${jobId}`;
    console.log(`Fetching tasks for job ${jobId} from:`, taskEndpoint);
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const taskResponse = await fetch(taskEndpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log(`Task API response status for job ${jobId} (attempt ${attempt}):`, taskResponse.status);
        if (!taskResponse.ok) {
          if (taskResponse.status === 404) {
            console.log(`No tasks found for job ${jobId}: ${taskResponse.statusText}`);
            return { hasTasks: false, taskId: null };
          }
          throw new Error(`Failed to fetch tasks: ${taskResponse.statusText}`);
        }

        const taskResult = await taskResponse.json();
        console.log(`Tasks for job ${jobId} (attempt ${attempt}):`, JSON.stringify(taskResult, null, 2));

        // Handle both object and array responses
        const hasTasks = taskResult.success && (
          (Array.isArray(taskResult.data) && taskResult.data.length > 0) ||
          (taskResult.data && typeof taskResult.data === 'object' && Object.keys(taskResult.data).length > 0)
        );
        const taskId = hasTasks && Array.isArray(taskResult.data) && taskResult.data[0] ? taskResult.data[0].id : 
                       hasTasks && taskResult.data && taskResult.data.id ? taskResult.data.id : null;

        return { hasTasks, taskId };
      } catch (err) {
        console.warn(`Error fetching tasks for job ${jobId} (attempt ${attempt}): ${err.message}`);
        if (attempt < retries) {
          console.log(`Retrying task fetch for job ${jobId} after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          return { hasTasks: false, taskId: null };
        }
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      const authToken = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const profileId = localStorage.getItem("profileId");

      console.log("Company ID:", profileId, "User Role:", userRole, "Refresh Key:", refreshKey);

      if (!authToken || !["Employer", "Company"].includes(userRole)) {
        if (isMounted) {
          setError("You must be logged in as an Employer to view active jobs");
          navigate("/login");
        }
        return;
      }

      if (!profileId) {
        if (isMounted) {
          setError("Company ID is missing. Please log in again or contact support at support@fit4job.com.");
          navigate("/login");
        }
        return;
      }

      try {
        setIsLoading(true);
        const endpoint = `http://fit4job.runasp.net/api/Jobs/Company/${profileId}?t=${Date.now()}`;
        console.log("Fetching jobs from:", endpoint);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Jobs API response status:", response.status);
        if (!response.ok) {
          const text = await response.text();
          let result;
          try {
            result = JSON.parse(text);
            throw new Error(result.message || `Failed to fetch jobs: ${response.statusText}`);
          } catch {
            throw new Error(`Failed to fetch jobs: ${response.statusText}`);
          }
        }

        const result = await response.json();
        console.log("Fetched jobs response:", JSON.stringify(result, null, 2));

        if (result.success && Array.isArray(result.data)) {
          const filteredJobs = result.data.filter((job) => String(job.companyId) === String(profileId));
          // Fetch tasks for each job
          const jobsWithTasks = await Promise.all(
            filteredJobs.map(async (job) => {
              const { hasTasks, taskId } = await fetchTasksForJob(job.id, authToken);
              return { ...job, hasTasks, taskId };
            })
          );
          if (isMounted) setJobs(jobsWithTasks);
        } else if (result.errorCode === 101 || result.message === "No jobs found for this company.") {
          if (isMounted) setJobs([]);
        } else {
          throw new Error(result.message || "Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        if (isMounted) {
          setError(
            err.message.includes("You must be logged in as an Employer")
              ? "You must be logged in as an Employer to view active jobs. Please verify your account type or contact support at support@fit4job.com."
              : `Failed to fetch jobs: ${err.message}. Please try again or contact support at support@fit4job.com.`
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [navigate, refreshKey]);

  const handleAddNew = () => {
    navigate("/job-quiz/0");
  };

  const handleEdit = (jobId) => {
    navigate(`/job-quiz/${jobId}`, { state: { refreshJobs } });
    setDropdownOpen(null);
  };

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm("Are you sure you want to delete this job?");
    if (!confirmed) return;

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://fit4job.runasp.net/api/Jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs(jobs.filter((job) => job.id !== jobId));
      if (refreshJobs) refreshJobs();
    } catch (err) {
      setError(`Failed to delete job: ${err.message}. Please try again or contact support at support@fit4job.com.`);
    } finally {
      setDropdownOpen(null);
    }
  };

  const handleEditTask = (jobId, taskId) => {
    navigate(`/job/${jobId}/tasks/edit/${taskId}`);
    setTaskDropdownOpen(null);
  };

  const handleDeleteTask = async (jobId, taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://fit4job.runasp.net/api/CompanyTasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Refresh jobs to update task status
      if (refreshJobs) refreshJobs();
      setJobs(jobs.map((job) => (job.id === jobId ? { ...job, hasTasks: false, taskId: null } : job)));
    } catch (err) {
      setError(`Failed to delete task: ${err.message}. Please try again or contact support at support@fit4job.com.`);
    } finally {
      setTaskDropdownOpen(null);
    }
  };

  const handleViewTask = (jobId, taskId) => {
    navigate(`/job/${jobId}/tasks/${taskId}`);
    setTaskDropdownOpen(null);
  };

  const toggleDropdown = (jobId) => {
    console.log("toggleDropdown called for jobId:", jobId);
    setDropdownOpen(dropdownOpen === jobId ? null : jobId);
    setTaskDropdownOpen(null);
  };

  const toggleTaskDropdown = (jobId) => {
    console.log("toggleTaskDropdown called for jobId:", jobId);
    setTaskDropdownOpen(taskDropdownOpen === jobId ? null : jobId);
    setDropdownOpen(null);
  };

  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    if (refreshJobs) refreshJobs();
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <div className="flex gap-3">
          <button
            onClick={handleAddNew}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Add New
          </button>
          <button
            onClick={handleRefresh}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Refresh
          </button>
        </div>
      </div>

      {isLoading && <p className="text-gray-500">Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && jobs.length === 0 && (
        <p className="text-gray-500">
          No active jobs found.{" "}
          <button onClick={handleAddNew} className="text-blue-600 hover:underline">
            Post a new job
          </button>{" "}
          or click{" "}
          <button onClick={handleRefresh} className="text-blue-600 hover:underline">
            Refresh
          </button>{" "}
          to check for recent updates.
        </p>
      )}

      <div className="space-y-4">
        {jobs.map((job, idx) => (
          <div
            key={job.id || idx}
            className="border rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-sm"
          >
            <div>
              <h4 className="font-medium text-gray-800">{job.title}</h4>
              <p className="text-sm text-gray-500">
                {jobTypeMap[job.jobType] || "Unknown Job Type"} •{" "}
                {locationTypeMap[job.workLocationType] || "Unknown Location"} •{" "}
                {educationLevelMap[job.educationLevel] || "Education not specified"} •{" "}
                {job.salaryRange || "Salary not specified"}
              </p>
            </div>
            <div className="flex items-center gap-3 relative">
              {job.hasTasks && (
                <span
                  className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full cursor-pointer"
                  title="Click to manage tasks"
                  onClick={() => toggleTaskDropdown(job.id)}
                >
                  Contains Tasks
                </span>
              )}
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Active
              </span>
              <MoreVertical
                className="w-4 h-4 text-gray-500 cursor-pointer"
                onClick={() => toggleDropdown(job.id)}
              />
              {dropdownOpen === job.id && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-6 bg-white border rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => handleEdit(job.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Job
                  </button>
                </div>
              )}
              {taskDropdownOpen === job.id && job.hasTasks && (
                <div
                  ref={taskDropdownRef}
                  className="absolute right-0 top-6 bg-white border rounded-lg shadow-lg z-10"
                >
                  <button
                    onClick={() => handleEditTask(job.id, job.taskId)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => handleDeleteTask(job.id, job.taskId)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Task
                  </button>
                  <button
                    onClick={() => handleViewTask(job.id, job.taskId)}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                  >
                    View Task
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}