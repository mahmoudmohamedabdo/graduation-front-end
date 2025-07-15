import React, { useState, useEffect } from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ActiveJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mappings from JobPostForm.jsx
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
    const fetchJobs = async () => {
      const authToken = localStorage.getItem("authToken");
      const userRole = localStorage.getItem("userRole");
      const companyId = localStorage.getItem("companyId");

      if (!authToken || userRole !== "Employer" || !companyId) {
        alert("You must be logged in as an Employer to view active jobs.");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch("http://fit4job.runasp.net/api/Jobs/company/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Fetched jobs response:", JSON.stringify(result, null, 2));

        if (result.success && Array.isArray(result.data)) {
          // Filter jobs by companyId to ensure only the logged-in company's jobs are shown
          const filteredJobs = result.data.filter(
            (job) => job.companyId === parseInt(companyId)
          );
          setJobs(filteredJobs);
        } else {
          throw new Error(result.message || "Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [navigate]);

  const handleAddNew = () => {
    navigate("/job-post");
  };

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <button
          onClick={handleAddNew}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Add New
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && jobs.length === 0 && (
        <p className="text-gray-500">No active jobs found.</p>
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
            <div className="flex items-center gap-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Active
              </span>
              <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}