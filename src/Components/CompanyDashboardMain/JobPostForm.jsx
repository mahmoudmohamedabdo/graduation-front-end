import React, { useState } from "react";
import { SidebarLayout } from "../../layouts/SidebarLayout";
import { useNavigate, useLocation } from "react-router-dom";

export default function JobPostForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const refreshJobs = location.state?.refreshJobs || (() => {});
  const companyId = localStorage.getItem("companyId");
  const [formData, setFormData] = useState({
    companyId: companyId ? parseInt(companyId) : null,
    title: "",
    jobType: "",
    workLocationType: "",
    educationLevel: "",
    summary: "",
    requirements: "",
    salaryRange: "",
    yearsOfExperience: "",
    isActive: true,
  });
  const [assessmentOption, setAssessmentOption] = useState("No additional steps");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  if (!companyId) {
    setErrors({ general: "Company ID is missing. Please log in again." });
    navigate("/login");
    return null;
  }

  const jobTypeMap = {
    Freelance: 1,
    "Part-Time": 2,
    Internship: 3,
    "Full-Time": 4,
  };

  const locationTypeMap = {
    Remote: 1,
    Hybrid: 2,
    Onsite: 3,
  };

  const educationLevelMap = {
    PhD: 1,
    "Master’s Degree": 2,
    "Bachelor's Degree": 3,
    "Associate Degree": 4,
    "High School": 5,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };
    switch (name) {
      case "title":
        if (!value.trim()) {
          fieldErrors.title = "Job Title is required";
        } else if (value.trim().length < 3 || value.trim().length > 256) {
          fieldErrors.title = "Job Title must be between 3 and 256 characters";
        } else {
          delete fieldErrors.title;
        }
        break;
      case "jobType":
        if (!value || !jobTypeMap[value]) {
          fieldErrors.jobType = "Valid Job Type is required";
        } else {
          delete fieldErrors.jobType;
        }
        break;
      case "workLocationType":
        if (!value || !locationTypeMap[value]) {
          fieldErrors.workLocationType = "Valid Location Type is required";
        } else {
          delete fieldErrors.workLocationType;
        }
        break;
      case "summary":
        if (!value.trim()) {
          fieldErrors.summary = "Job Summary is required";
        } else if (value.trim().length < 10 || value.trim().length > 2000) {
          fieldErrors.summary = "Job Summary must be between 10 and 2,000 characters";
        } else {
          delete fieldErrors.summary;
        }
        break;
      case "requirements":
        if (!value.trim()) {
          fieldErrors.requirements = "Job Requirements is required";
        } else if (value.trim().length < 10 || value.trim().length > 2000) {
          fieldErrors.requirements = "Job Requirements must be between 10 and 2,000 characters";
        } else {
          delete fieldErrors.requirements;
        }
        break;
      case "salaryRange":
        if (value && !/^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(value)) {
          fieldErrors.salaryRange = "Salary Range must be in a valid format (e.g., $80,000 or $80,000.00)";
        } else {
          delete fieldErrors.salaryRange;
        }
        break;
      case "yearsOfExperience":
        if (value && !/^\d+(\s*-\s*\d+)?(\s*years)?$/i.test(value)) {
          fieldErrors.yearsOfExperience = "Years of Experience must be a number or range (e.g., 2 or 2-5 years)";
        } else {
          delete fieldErrors.yearsOfExperience;
        }
        break;
      default:
        break;
    }
    setErrors(fieldErrors);
  };

  const validateForm = () => {
    const fieldErrors = {};
    if (!formData.title.trim()) {
      fieldErrors.title = "Job Title is required";
    } else if (formData.title.trim().length < 3 || formData.title.trim().length > 256) {
      fieldErrors.title = "Job Title must be between 3 and 256 characters";
    }

    if (!formData.jobType || !jobTypeMap[formData.jobType]) {
      fieldErrors.jobType = "Valid Job Type is required";
    }

    if (!formData.workLocationType || !locationTypeMap[formData.workLocationType]) {
      fieldErrors.workLocationType = "Valid Location Type is required";
    }

    if (!formData.summary.trim()) {
      fieldErrors.summary = "Job Summary is required";
    } else if (formData.summary.trim().length < 10 || formData.summary.trim().length > 2000) {
      fieldErrors.summary = "Job Summary must be between 10 and 2,000 characters";
    }

    if (!formData.requirements.trim()) {
      fieldErrors.requirements = "Job Requirements is required";
    } else if (formData.requirements.trim().length < 10 || formData.requirements.trim().length > 2000) {
      fieldErrors.requirements = "Job Requirements must be between 10 and 2,000 characters";
    }

    if (formData.salaryRange && !/^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/.test(formData.salaryRange)) {
      fieldErrors.salaryRange = "Salary Range must be in a valid format (e.g., $80,000 or $80,000.00)";
    }

    if (formData.yearsOfExperience && !/^\d+(\s*-\s*\d+)?(\s*years)?$/i.test(formData.yearsOfExperience)) {
      fieldErrors.yearsOfExperience = "Years of Experience must be a number or range (e.g., 2 or 2-5 years)";
    }

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    if (validateForm()) {
      try {
        const payload = {
          ...formData,
          companyId: parseInt(companyId),
          jobType: jobTypeMap[formData.jobType],
          workLocationType: locationTypeMap[formData.workLocationType],
          educationLevel: formData.educationLevel ? educationLevelMap[formData.educationLevel] : null,
          salaryRange: formData.salaryRange || null,
          yearsOfExperience: formData.yearsOfExperience || null,
        };

        console.log("Sending payload:", JSON.stringify(payload, null, 2));

        const response = await fetch("http://fit4job.runasp.net/api/Jobs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.message || `Failed to create job post: ${response.statusText}`;
          console.error("API Error Details:", errorData);
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("Created job response:", JSON.stringify(result, null, 2));

        if (result.success) {
          alert("Job Added Successfully");
          setSuccess(true);
          refreshJobs();
          setFormData({
            companyId: parseInt(companyId),
            title: "",
            jobType: "",
            workLocationType: "",
            educationLevel: "",
            summary: "",
            requirements: "",
            salaryRange: "",
            yearsOfExperience: "",
            isActive: true,
          });
          navigate("/companydashboard");
        } else {
          throw new Error(result.message || "Unknown error during job creation");
        }
      } catch (err) {
        setErrors({ general: err.message });
        console.error("API Error:", err.message);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-10 w-full">
        <div className="bg-white rounded-lg shadow sm:p-4 md:p-6 lg:p-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">Create Job Post</h2>

          {errors.general && <div className="text-red-500 mb-2 sm:mb-4">{errors.general}</div>}
          {success && <div className="text-green-500 mb-2 sm:mb-4">Job post created successfully!</div>}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Job Title * (3-256 characters)</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={(e) => validateField("title", e.target.value)}
                placeholder="Senior Software Engineer"
                className={`w-full rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#F7F7F7] text-gray-500 border ${errors.title ? "border-red-500" : "border-gray-200"}`}
                required
              />
              {errors.title && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.title.length}/256 characters</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Job Type *</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField("jobType", e.target.value)}
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-500 bg-white ${errors.jobType ? "border-red-500" : "border-gray-200"}`}
                  required
                >
                  <option value="" disabled>Select job type</option>
                  <option>Freelance</option>
                  <option>Part-Time</option>
                  <option>Internship</option>
                  <option>Full-Time</option>
                </select>
                {errors.jobType && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.jobType}</div>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Location *</label>
                <select
                  name="workLocationType"
                  value={formData.workLocationType}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField("workLocationType", e.target.value)}
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-500 bg-white ${errors.workLocationType ? "border-red-500" : "border-gray-200"}`}
                  required
                >
                  <option value="" disabled>Select Location type</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>Onsite</option>
                </select>
                {errors.workLocationType && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.workLocationType}</div>}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Job Summary * (10-2,000 characters)</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                onBlur={(e) => validateField("summary", e.target.value)}
                rows="3"
                placeholder="Brief overview of the role and key responsibilities..."
                className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-700 ${errors.summary ? "border-red-500" : "border-gray-200"}`}
                required
              />
              {errors.summary && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.summary}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.summary.length}/2,000 characters</div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Job Requirements * (10-2,000 characters)</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                onBlur={(e) => validateField("requirements", e.target.value)}
                rows="3"
                placeholder="Required skills, qualifications, and experience..."
                className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-700 ${errors.requirements ? "border-red-500" : "border-gray-200"}`}
                required
              />
              {errors.requirements && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.requirements}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.requirements.length}/2,000 characters</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Salary Range (Optional)</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField("salaryRange", e.target.value)}
                  placeholder="$80,000 or .$,0468,21"
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 bg-[#f7f7f7] ${errors.salaryRange ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.salaryRange && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.salaryRange}</div>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Years of Experience (Optional)</label>
                <input
                  type="text"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField("yearsOfExperience", e.target.value)}
                  placeholder="2sy- 59-r593732 or 3-5 years"
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-700 bg-[#f7f7f7] ${errors.yearsOfExperience ? "border-red-500" : "border-gray-200"}`}
                />
                {errors.yearsOfExperience && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.yearsOfExperience}</div>}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">Education Level (Optional)</label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                className="w-full border border-gray-200 rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-500 bg-white"
              >
                <option value="">Select education level</option>
                <option>PhD</option>
                <option>Master’s Degree</option>
                <option>Bachelor's Degree</option>
                <option>Associate Degree</option>
                <option>High School</option>
              </select>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Would you like to attach Tasks or Quizzes to this job?
              </label>
              <select
                className="w-full border border-gray-200 rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-500 bg-white"
                value={assessmentOption}
                onChange={(e) => setAssessmentOption(e.target.value)}
              >
                <option>No additional steps</option>
                <option>Add Quiz</option>
                <option>Add Task</option>
                <option>Add Quiz and Task</option>
              </select>
            </div>

            {assessmentOption !== "No additional steps" && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-3 sm:mb-4">
                {(assessmentOption === "Add Quiz" || assessmentOption === "Add Quiz and Task") && (
                  <button
                    type="button"
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-500 text-white text-xs sm:text-sm md:text-base rounded-md hover:bg-blue-600 w-full sm:w-auto"
                  >
                    Add Quiz
                  </button>
                )}
                {(assessmentOption === "Add Task" || assessmentOption === "Add Quiz and Task") && (
                  <button
                    type="button"
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-yellow-500 text-white text-xs sm:text-sm md:text-base rounded-md hover:bg-yellow-600 w-full sm:w-auto"
                  >
                    Add Task
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                type="button"
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-xs sm:text-sm md:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm md:text-base ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""} w-full sm:w-auto`}
              >
                {isSubmitting ? "Creating..." : "Create Job Post"}
              </button>
            </div>
          </form>

          <p className="text-center text-xs sm:text-sm mt-4 sm:mt-6">
            Once published, candidates can apply and complete any attached tasks or quizzes.
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}