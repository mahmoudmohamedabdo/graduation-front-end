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
      const companyId = localStorage.getItem("companyId") || localStorage.getItem("userId");

      console.log("Company ID:", companyId, "User Role:", userRole);

      if (!authToken || !["Employer", "Company"].includes(userRole)) {
        setError("You must be logged in as an Employer to view active jobs");
        navigate("/login");
        return;
      }

      if (!companyId) {
        setError("Company ID is missing. Please log in again or contact support at support@fit4job.com.");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const endpoint = `http://fit4job.runasp.net/api/Jobs/Company/${companyId}`;
        console.log("Fetching jobs from:", endpoint);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${authToken}`,
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
          const filteredJobs = result.data.filter((job) => job.companyId === parseInt(companyId));
          setJobs(filteredJobs);
        } else if (!result.success && result.message === "No jobs found for this company.") {
          setJobs([]); // Handle no jobs case gracefully
        } else {
          throw new Error(result.message || "Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching jobs:", err.message);
        setError(
          err.message.includes("You must be logged in as an Employer")
            ? "You must be logged in as an Employer to view active jobs. Please verify your account type or contact support at support@fit4job.com."
            : `Failed to fetch jobs: ${err.message}. Please try again or contact support at support@fit4job.com.`
        );
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
        <p className="text-gray-500">
          No active jobs found.{" "}
          <button
            onClick={handleAddNew}
            className="text-blue-600 hover:underline"
          >
            Post a new job
          </button>
          .
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