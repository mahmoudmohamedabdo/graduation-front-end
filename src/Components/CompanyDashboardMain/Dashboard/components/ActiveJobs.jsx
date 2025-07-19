import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EditTaskModal from "../../EditTaskModal";

export default function ActiveJobs({ refreshKey, refreshJobs }) {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(null);
  const [editTaskData, setEditTaskData] = useState(null);
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

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      const authToken = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const profileId = localStorage.getItem("profileId");

      if (!authToken || !["Employer", "Company"].includes(userRole)) {
        if (isMounted) {
          setError("You must be logged in as an Employer to view active jobs");
          navigate("/login");
        }
        return;
      }

      if (!profileId) {
        if (isMounted) {
          setError("Company ID is missing. Please log in again or contact support.");
          navigate("/login");
        }
        return;
      }

      try {
        setIsLoading(true);
        const endpoint = `http://fit4job.runasp.net/api/Jobs/Company/${profileId}?t=${Date.now()}`;
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const filteredJobs = result.data.filter((job) => String(job.companyId) === String(profileId));
          const jobsWithTasks = await Promise.all(
            filteredJobs.map(async (job) => {
              let task = null;
              let hasTasks = false;

              try {
                const taskResponse = await fetch(
                  `http://fit4job.runasp.net/api/CompanyTasks/job/${job.id}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                      "Content-Type": "application/json",
                      accept: "text/plain",
                    },
                  }
                );

                if (taskResponse.ok) {
                  const taskResult = await taskResponse.json();
                  if (taskResult.success && taskResult.data) {
                    task = taskResult.data;
                    hasTasks = true;
                  }
                }
              } catch (err) {
                console.error(`Error fetching task for job ${job.id}:`, err);
              }

              return {
                ...job,
                hasTasks,
                task,
              };
            })
          );

          if (isMounted) {
            setJobs(jobsWithTasks);
          }
        } else {
          throw new Error(result.message || "No jobs found");
        }
      } catch (err) {
        if (isMounted) setError(`Failed to fetch jobs: ${err.message}`);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [navigate, refreshKey]);

  const handleAddNew = () => navigate("/job-quiz/0");

  const handleEdit = (jobId) => {
    navigate(`/job-quiz/${jobId}`);
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

      if (!response.ok) throw new Error("Failed to delete job");

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

  const handleDeleteTask = async (jobId, taskId) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://fit4job.runasp.net/api/CompanyTasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          accept: "text/plain",
        },
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, task: null, hasTasks: false } : job
        )
      );
      if (refreshJobs) refreshJobs();
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
    } finally {
      setTaskDropdownOpen(null);
    }
  };


  const toggleDropdown = (jobId) => {
    setDropdownOpen(dropdownOpen === jobId ? null : jobId);
    setTaskDropdownOpen(null);
  };

  const toggleTaskDropdown = (jobId) => {
    setTaskDropdownOpen(taskDropdownOpen === jobId ? null : jobId);
    setDropdownOpen(null);
  };

  const handleTaskModalClose = () => setEditTaskData(null);

  const handleTaskModalSave = async (updatedTask) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://fit4job.runasp.net/api/CompanyTasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
          accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === editTaskData.jobId
            ? { ...job, task: updatedTask, hasTasks: true }
            : job
        )
      );
      alert("Task edited successfully!");
      setEditTaskData(null);
      if (refreshJobs) refreshJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Active Jobs</h2>
          <button
            onClick={handleAddNew}
            className="text-blue-600 text-base font-semibold hover:underline transition-colors"
          >
            Add New
          </button>
        </div>

        {isLoading && <p className="text-gray-500 text-center text-lg">Loading jobs...</p>}
        {error && <p className="text-red-500 text-center text-lg">{error}</p>}
        {!isLoading && !error && jobs.length === 0 && (
          <p className="text-gray-500 text-center text-lg">
            No active jobs found.{" "}
            <button onClick={handleAddNew} className="text-blue-600 hover:underline">
              Post a new job
            </button>
            .
          </p>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <div className="space-y-8">
            {/* Jobs with Tasks Section */}
            {jobs.some((job) => job.hasTasks) && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Jobs with Tasks</h3>
                <div className="space-y-6">
                  {jobs
                    .filter((job) => job.hasTasks)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-xl p-5 flex justify-between items-start hover:shadow-xl transition-shadow duration-300 bg-white"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {jobTypeMap[job.jobType] || "Unknown Job Type"} •{" "}
                            {locationTypeMap[job.workLocationType] || "Unknown Location"} •{" "}
                            {educationLevelMap[job.educationLevel] || "Education not specified"} •{" "}
                            {job.salaryRange || "Salary not specified"}
                          </p>
                          {job.task && (
                            <div className="mt-4 text-sm text-gray-700">
                              <strong className="font-medium">Task Details:</strong>
                              <p className="mt-1"><span className="font-semibold">Title:</span> {job.task.title}</p>
                              <p className="mt-1"><span className="font-semibold">Deadline:</span> {new Date(job.task.deadline).toLocaleDateString()}</p>
                              <p className="mt-1"><span className="font-semibold">Estimated Hours:</span> {job.task.estimatedHours}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4 relative">
                          <span
                            className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full cursor-pointer hover:bg-green-200 transition-colors"
                            title="Click to manage task"
                            onClick={() => toggleTaskDropdown(job.id)}
                          >
                            Contains Task
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            Active
                          </span>
                          <MoreVertical
                            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                            onClick={() => toggleDropdown(job.id)}
                          />
                          {dropdownOpen === job.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40"
                            >
                              <button
                                onClick={() => handleEdit(job.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Edit Job
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                              >
                                Delete Job
                              </button>
                            </div>
                          )}
                          {taskDropdownOpen === job.id && job.hasTasks && job.task && (
                            <div
                              ref={taskDropdownRef}
                              className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40"
                            >
                              <button
                                onClick={() => handleEditTask(job.id, job.task.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Edit Task: {job.task.title}
                              </button>
                              <button
                                onClick={() => handleDeleteTask(job.id, job.task.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                              >
                                Delete Task: {job.task.title}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Jobs without Tasks Section */}
            {jobs.some((job) => !job.hasTasks) && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-2">Jobs without Tasks</h3>
                <div className="space-y-6">
                  {jobs
                    .filter((job) => !job.hasTasks)
                    .map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-xl p-5 flex justify-between items-start hover:shadow-xl transition-shadow duration-300 bg-white"
                      >
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600 mt-2">
                            {jobTypeMap[job.jobType] || "Unknown Job Type"} •{" "}
                            {locationTypeMap[job.workLocationType] || "Unknown Location"} •{" "}
                            {educationLevelMap[job.educationLevel] || "Education not specified"} •{" "}
                            {job.salaryRange || "Salary not specified"}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 relative">
                          <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                            No Task
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            Active
                          </span>
                          <MoreVertical
                            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                            onClick={() => toggleDropdown(job.id)}
                          />
                          {dropdownOpen === job.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-40"
                            >
                              <button
                                onClick={() => handleEdit(job.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                Edit Job
                              </button>
                              <button
                                onClick={() => handleDelete(job.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                              >
                                Delete Job
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
        {editTaskData && (
          <EditTaskModal
            task={editTaskData.task}
            onClose={handleTaskModalClose}
            onSave={handleTaskModalSave}
          />
        )}
      </div>      {editTaskData && (
        <EditTaskModal
          task={editTaskData.task}
          onClose={handleTaskModalClose}
          onSave={handleTaskModalSave}
        />
      )}
    </div>
  );
}
