import React, { useState, useEffect } from "react";
import { SidebarLayout } from "../../layouts/SidebarLayout";
import { useParams, useNavigate } from "react-router-dom";

export default function JobPostForm({ refreshJobs }) {
    const { id } = useParams(); // Get job ID from route
    const navigate = useNavigate();
    const profileId = localStorage.getItem('profileId');
    const [formData, setFormData] = useState({
        companyId: profileId, 
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
    const [taskData, setTaskData] = useState({
        companyId: profileId ? parseInt(profileId) : null,
        jobId: id || 0, // Will be updated after job creation
        title: "",
        description: "",
        requirements: "",
        deliverables: "",
        deadline: "",
        estimatedHours: "",
    });
    const [assessmentOption, setAssessmentOption] = useState("No additional steps");
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTaskSubmitting, setIsTaskSubmitting] = useState(false);
    const [errors, setErrors] = useState({}); // Store errors per field
    const [taskErrors, setTaskErrors] = useState({}); // Store task form errors
    const [success, setSuccess] = useState(false);
    const [taskSuccess, setTaskSuccess] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    // Reverse mappings for populating form from API data
    const reverseJobTypeMap = Object.fromEntries(Object.entries(jobTypeMap).map(([k, v]) => [v, k]));
    const reverseLocationTypeMap = Object.fromEntries(Object.entries(locationTypeMap).map(([k, v]) => [v, k]));
    const reverseEducationLevelMap = Object.fromEntries(Object.entries(educationLevelMap).map(([k, v]) => [v, k]));

    // Fetch job data if in edit mode
    useEffect(() => {
        if (id && id !== "0") {
            setIsEditMode(true);
            setIsLoading(true);
            const fetchJob = async () => {
                try {
                    const response = await fetch(`http://fit4job.runasp.net/api/Jobs/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || `Failed to fetch job: ${response.statusText}`);
                    }

                    const result = await response.json();
                    console.log("Fetched job data:", result);

                    if (result.success && result.data) {
                        const job = result.data;
                        setFormData({
                            companyId: profileId,
                            title: job.title || "",
                            jobType: reverseJobTypeMap[job.jobType] || "",
                            workLocationType: reverseLocationTypeMap[job.workLocationType] || "",
                            educationLevel: reverseEducationLevelMap[job.educationLevel] || "",
                            summary: job.summary || "",
                            requirements: job.requirements || "",
                            salaryRange: job.salaryRange || "",
                            yearsOfExperience: job.yearsOfExperience || "",
                            isActive: job.isActive !== undefined ? job.isActive : true,
                        });
                        setTaskData((prev) => ({ ...prev, jobId: id }));
                    } else {
                        throw new Error("Invalid job data");
                    }
                } catch (err) {
                    setErrors({ general: `Failed to load job: ${err.message}. Please try again or contact support.` });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchJob();
        }
    }, [id, profileId]);

    // Handle job form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateField(name, value);
    };

    // Handle task form input changes
    const handleTaskInputChange = (e) => {
        const { name, value } = e.target;
        setTaskData((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateTaskField(name, value);
    };

    // Validate job form field
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
                if (value && !/^\$?\d{1,4}(,\d{3})*(?:\.\d{2})?$/.test(value)) {
                    fieldErrors.salaryRange = "Salary Range must be in a valid format (e.g., $80,000 or $80,000.00)";
                } else {
                    delete fieldErrors.salaryRange;
                }
                break;
            case "yearsOfExperience":
                if (value && !/^\d+[a-zA-Z0-9\s-]*$/.test(value)) {
                    fieldErrors.yearsOfExperience = "Years of Experience must start with a number (e.g., '3-5 years')";
                } else {
                    delete fieldErrors.yearsOfExperience;
                }
                break;
            default:
                break;
        }
        setErrors(fieldErrors);
    };

    // Validate task form field
    const validateTaskField = (name, value) => {
        let fieldErrors = { ...taskErrors };

        switch (name) {
            case "title":
                if (!value.trim()) {
                    fieldErrors.title = "Task Title is required";
                } else if (value.trim().length < 3 || value.trim().length > 256) {
                    fieldErrors.title = "Task Title must be between 3 and 256 characters";
                } else {
                    delete fieldErrors.title;
                }
                break;
            case "description":
                if (!value.trim()) {
                    fieldErrors.description = "Task Description is required";
                } else if (value.trim().length < 10 || value.trim().length > 2000) {
                    fieldErrors.description = "Task Description must be between 10 and 2,000 characters";
                } else {
                    delete fieldErrors.description;
                }
                break;
            case "requirements":
                if (!value.trim()) {
                    fieldErrors.requirements = "Task Requirements is required";
                } else if (value.trim().length < 10 || value.trim().length > 2000) {
                    fieldErrors.requirements = "Task Requirements must be between 10 and 2,000 characters";
                } else {
                    delete fieldErrors.requirements;
                }
                break;
            case "deliverables":
                if (!value.trim()) {
                    fieldErrors.deliverables = "Task Deliverables is required";
                } else if (value.trim().length < 10 || value.trim().length > 2000) {
                    fieldErrors.deliverables = "Task Deliverables must be between 10 and 2,000 characters";
                } else {
                    delete fieldErrors.deliverables;
                }
                break;
            case "deadline":
                if (!value) {
                    fieldErrors.deadline = "Task Deadline is required";
                } else {
                    const deadlineDate = new Date(value);
                    const now = new Date();
                    now.setHours(now.getHours() + 1);
                    if (deadlineDate <= now) {
                        fieldErrors.deadline = "Task Deadline must be at least one hour in the future";
                    } else {
                        delete fieldErrors.deadline;
                    }
                }
                break;
            case "estimatedHours":
                if (!value) {
                    fieldErrors.estimatedHours = "Estimated Hours is required";
                } else if (!/^\d+$/.test(value) || parseInt(value) <= 0 || parseInt(value) > 1000) {
                    fieldErrors.estimatedHours = "Estimated Hours must be a positive integer between 1 and 1000";
                } else {
                    delete fieldErrors.estimatedHours;
                }
                break;
            default:
                break;
        }
        setTaskErrors(fieldErrors);
    };

    // Validate entire job form
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

        if (formData.salaryRange && !/^\$?\d{1,4}(,\d{3})*(?:\.\d{2})?$/.test(formData.salaryRange)) {
            fieldErrors.salaryRange = "Salary Range must be in a valid format (e.g., $80,000 or $80,000.00)";
        }

        if (formData.yearsOfExperience && !/^\d+[a-zA-Z0-9\s-]*$/.test(formData.yearsOfExperience)) {
            fieldErrors.yearsOfExperience = "Years of Experience must start with a number (e.g., '3-5 years')";
        }

        setErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    // Validate entire task form
    const validateTaskForm = () => {
        const fieldErrors = {};
        if (!taskData.title.trim()) {
            fieldErrors.title = "Task Title is required";
        } else if (taskData.title.trim().length < 3 || taskData.title.trim().length > 256) {
            fieldErrors.title = "Task Title must be between 3 and 256 characters";
        }

        if (!taskData.description.trim()) {
            fieldErrors.description = "Task Description is required";
        } else if (taskData.description.trim().length < 10 || taskData.description.trim().length > 2000) {
            fieldErrors.description = "Task Description must be between 10 and 2,000 characters";
        }

        if (!taskData.requirements.trim()) {
            fieldErrors.requirements = "Task Requirements is required";
        } else if (taskData.requirements.trim().length < 10 || taskData.requirements.trim().length > 2000) {
            fieldErrors.requirements = "Task Requirements must be between 10 and 2,000 characters";
        }

        if (!taskData.deliverables.trim()) {
            fieldErrors.deliverables = "Task Deliverables is required";
        } else if (taskData.deliverables.trim().length < 10 || taskData.deliverables.trim().length > 2000) {
            fieldErrors.deliverables = "Task Deliverables must be between 10 and 2,000 characters";
        }

        if (!taskData.deadline) {
            fieldErrors.deadline = "Task Deadline is required";
        } else {
            const deadlineDate = new Date(taskData.deadline);
            const now = new Date();
            now.setHours(now.getHours() + 1);
            if (deadlineDate <= now) {
                fieldErrors.deadline = "Task Deadline must be at least one hour in the future";
            }
        }

        if (!taskData.estimatedHours) {
            fieldErrors.estimatedHours = "Estimated Hours is required";
        } else if (!/^\d+$/.test(taskData.estimatedHours) || parseInt(taskData.estimatedHours) <= 0 || parseInt(taskData.estimatedHours) > 1000) {
            fieldErrors.estimatedHours = "Estimated Hours must be a positive integer between 1 and 1000";
        }

        if (!taskData.jobId || taskData.jobId <= 0) {
            fieldErrors.jobId = "A valid Job ID is required to create a task";
        }

        if (!taskData.companyId || taskData.companyId <= 0) {
            fieldErrors.companyId = "A valid Company ID is required";
        }

        setTaskErrors(fieldErrors);
        return Object.keys(fieldErrors).length === 0;
    };

    // Handle job form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setSuccess(false);

        if (validateForm()) {
            try {
                const payload = {
                    ...formData,
                    companyId: profileId ? parseInt(profileId) : null,
                    jobType: jobTypeMap[formData.jobType],
                    workLocationType: locationTypeMap[formData.workLocationType],
                    educationLevel: formData.educationLevel ? educationLevelMap[formData.educationLevel] : null,
                    salaryRange: formData.salaryRange || null,
                    yearsOfExperience: formData.yearsOfExperience || null,
                };

                console.log("Sending job payload:", JSON.stringify(payload, null, 2));
                console.log("Form Data:", formData);

                const endpoint = isEditMode
                    ? `http://fit4job.runasp.net/api/Jobs/${id}`
                    : "http://fit4job.runasp.net/api/Jobs";
                const method = isEditMode ? "PUT" : "POST";

                const response = await fetch(endpoint, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = errorData.message || `Failed to ${isEditMode ? "update" : "create"} job post: ${response.statusText}`;
                    console.error("API Error Details:", errorData);
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log("Created job response:", result);

                if (result.success) {
                    setSuccess(true);
                    if (!isEditMode && result.data?.id) {
                        setTaskData((prev) => ({ ...prev, jobId: parseInt(result.data.id) }));
                    }
                    if (refreshJobs) {
                        refreshJobs();
                    }
                    if (!isEditMode) {
                        setFormData({
                            companyId: profileId,
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
                    }
                    if (assessmentOption === "Add Task" || assessmentOption === "Add Quiz and Task") {
                        if (!result.data?.id && !isEditMode) {
                            throw new Error("Job ID not returned from server");
                        }
                        setShowTaskForm(true);
                    } else {
                        navigate("/companydashboard");
                    }
                } else {
                    throw new Error(result.message || `Unknown error during job ${isEditMode ? "update" : "creation"}`);
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

    // Handle task form submission
    const handleTaskSubmit = async (e) => {
        e.preventDefault();
        setIsTaskSubmitting(true);
        setTaskErrors({});
        setTaskSuccess(false);

        if (validateTaskForm()) {
            try {
                const payload = {
                    companyId: parseInt(taskData.companyId),
                    jobId: parseInt(taskData.jobId),
                    title: taskData.title,
                    description: taskData.description,
                    requirements: taskData.requirements,
                    deliverables: taskData.deliverables,
                    deadline: new Date(taskData.deadline).toISOString(),
                    estimatedHours: parseInt(taskData.estimatedHours),
                };

                console.log("Sending task payload:", JSON.stringify(payload, null, 2));

                const response = await fetch("http://fit4job.runasp.net/api/CompanyTasks", {
                    method: "POST",
                    headers: {
                        accept: "text/plain",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Task API Error Details:", JSON.stringify(errorData, null, 2));
                    const errorMessage = errorData.message || `Failed to create task: ${response.statusText}`;
                    if (errorData.errors) {
                        const fieldErrors = {};
                        Object.keys(errorData.errors).forEach((key) => {
                            fieldErrors[key.toLowerCase()] = errorData.errors[key].join(", ");
                        });
                        setTaskErrors(fieldErrors);
                    }
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                console.log("Created task response:", result);

                if (result.success) {
                    setTaskSuccess(true);
                    setTaskData({
                        companyId: profileId ? parseInt(profileId) : null,
                        jobId: taskData.jobId,
                        title: "",
                        description: "",
                        requirements: "",
                        deliverables: "",
                        deadline: "",
                        estimatedHours: "",
                    });
                    setShowTaskForm(false);
                    if (refreshJobs) {
                        refreshJobs(); // Trigger refresh after task creation
                    }
                    navigate("/companydashboard");
                } else {
                    throw new Error(result.message || "Unknown error during task creation");
                }
            } catch (err) {
                setTaskErrors({ general: err.message });
                console.error("Task API Error:", err.message);
            } finally {
                setIsTaskSubmitting(false);
            }
        } else {
            setIsTaskSubmitting(false);
        }
    };

    return (
        <SidebarLayout>
            <div className="bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-10 w-full">
                <div className="bg-white rounded-lg shadow sm:p-4 md:p-6 lg:p-10 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">
                        {isEditMode ? "Edit Job Post" : "Create Job Post"}
                    </h2>

                    {isLoading && <div className="text-gray-500 mb-2 sm:mb-4">Loading job data...</div>}
                    {errors.general && <div className="text-red-500 mb-2 sm:mb-4">{errors.general}</div>}
                    {success && (
                        <div className="text-green-500 mb-2 sm:mb-4">
                            Job post {isEditMode ? "updated" : "created"} successfully!
                        </div>
                    )}

                    {!showTaskForm ? (
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Job Title * (3-256 characters)
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    onBlur={(e) => validateField("title", e.target.value)}
                                    placeholder="Senior Software Engineer"
                                    className={`w-full rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#F7F7F7] text-gray-900 border ${
                                        errors.title ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</div>}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.title.length}/256 characters</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Job Type *
                                    </label>
                                    <select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField("jobType", e.target.value)}
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-white ${
                                            errors.jobType ? "border-red-500" : "border-gray-200"
                                        }`}
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
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Location *
                                    </label>
                                    <select
                                        name="workLocationType"
                                        value={formData.workLocationType}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField("workLocationType", e.target.value)}
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-white ${
                                            errors.workLocationType ? "border-red-500" : "border-gray-200"
                                        }`}
                                        required
                                    >
                                        <option value="" disabled>Select Location type</option>
                                        <option>Remote</option>
                                        <option>Hybrid</option>
                                        <option>Onsite</option>
                                    </select>
                                    {errors.workLocationType && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.workLocationType}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Job Summary * (10-2,000 characters)
                                </label>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleInputChange}
                                    onBlur={(e) => validateField("summary", e.target.value)}
                                    rows="3"
                                    placeholder="Brief overview of the role and key responsibilities..."
                                    className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                                        errors.summary ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {errors.summary && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.summary}</div>}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.summary.length}/2,000 characters</div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Job Requirements * (10-2,000 characters)
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleInputChange}
                                    onBlur={(e) => validateField("requirements", e.target.value)}
                                    rows="3"
                                    placeholder="Required skills, qualifications, and experience..."
                                    className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                                        errors.requirements ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {errors.requirements && (
                                    <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.requirements}</div>
                                )}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.requirements.length}/2,000 characters</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Salary Range (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="salaryRange"
                                        value={formData.salaryRange}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField("salaryRange", e.target.value)}
                                        placeholder="$80,000 or $80,000.00"
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                                            errors.salaryRange ? "border-red-500" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.salaryRange && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.salaryRange}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Years of Experience (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="yearsOfExperience"
                                        value={formData.yearsOfExperience}
                                        onChange={handleInputChange}
                                        onBlur={(e) => validateField("yearsOfExperience", e.target.value)}
                                        placeholder="3-5 years"
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                                            errors.yearsOfExperience ? "border-red-500" : "border-gray-200"
                                        }`}
                                    />
                                    {errors.yearsOfExperience && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.yearsOfExperience}</div>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Education Level (Optional)
                                </label>
                                <select
                                    name="educationLevel"
                                    value={formData.educationLevel}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-white"
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
                                    className="w-full border border-gray-200 rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-white"
                                    value={assessmentOption}
                                    onChange={(e) => {
                                        setAssessmentOption(e.target.value);
                                        setShowTaskForm(false);
                                    }}
                                >
                                    <option>No additional steps</option>
                                    <option>Add Quiz</option>
                                    <option>Add Task</option>
                                    <option>Add Quiz and Task</option>
                                </select>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate("/companydashboard")}
                                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isLoading}
                                    className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs sm:text-sm md:text-base ${
                                        (isSubmitting || isLoading) ? "opacity-50 cursor-not-allowed" : ""
                                    } w-full sm:w-auto`}
                                >
                                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Job Post" : "Create Job Post")}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleTaskSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
                            <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4">Add Task</h3>

                            {taskErrors.general && <div className="text-red-500 mb-2 sm:mb-4">{taskErrors.general}</div>}
                            {taskSuccess && (
                                <div className="text-green-500 mb-2 sm:mb-4">Task created successfully!</div>
                            )}

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Task Title * (3-256 characters)
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={taskData.title}
                                    onChange={handleTaskInputChange}
                                    onBlur={(e) => validateTaskField("title", e.target.value)}
                                    placeholder="Design a Website Mockup"
                                    className={`w-full rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#F7F7F7] text-gray-900 border ${
                                        taskErrors.title ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {taskErrors.title && <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.title}</div>}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{taskData.title.length}/256 characters</div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Task Description * (10-2,000 characters)
                                </label>
                                <textarea
                                    name="description"
                                    value={taskData.description}
                                    onChange={handleTaskInputChange}
                                    onBlur={(e) => validateTaskField("description", e.target.value)}
                                    rows="3"
                                    placeholder="Describe the task in detail..."
                                    className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                                        taskErrors.description ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {taskErrors.description && (
                                    <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.description}</div>
                                )}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{taskData.description.length}/2,000 characters</div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Task Requirements * (10-2,000 characters)
                                </label>
                                <textarea
                                    name="requirements"
                                    value={taskData.requirements}
                                    onChange={handleTaskInputChange}
                                    onBlur={(e) => validateTaskField("requirements", e.target.value)}
                                    rows="3"
                                    placeholder="Required skills or tools for the task..."
                                    className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                                        taskErrors.requirements ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {taskErrors.requirements && (
                                    <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.requirements}</div>
                                )}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{taskData.requirements.length}/2,000 characters</div>
                            </div>

                            <div className="mb-3 sm:mb-4">
                                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                    Task Deliverables * (10-2,000 characters)
                                </label>
                                <textarea
                                    name="deliverables"
                                    value={taskData.deliverables}
                                    onChange={handleTaskInputChange}
                                    onBlur={(e) => validateTaskField("deliverables", e.target.value)}
                                    rows="3"
                                    placeholder="Expected outputs or deliverables..."
                                    className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                                        taskErrors.deliverables ? "border-red-500" : "border-gray-200"
                                    }`}
                                    required
                                />
                                {taskErrors.deliverables && (
                                    <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.deliverables}</div>
                                )}
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{taskData.deliverables.length}/2,000 characters</div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Deadline *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="deadline"
                                        value={taskData.deadline}
                                        onChange={handleTaskInputChange}
                                        onBlur={(e) => validateTaskField("deadline", e.target.value)}
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                                            taskErrors.deadline ? "border-red-500" : "border-gray-200"
                                        }`}
                                        required
                                    />
                                    {taskErrors.deadline && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.deadline}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                                        Estimated Hours *
                                    </label>
                                    <input
                                        type="number"
                                        name="estimatedHours"
                                        value={taskData.estimatedHours}
                                        onChange={handleTaskInputChange}
                                        onBlur={(e) => validateTaskField("estimatedHours", e.target.value)}
                                        placeholder="100"
                                        className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                                            taskErrors.estimatedHours ? "border-red-500" : "border-gray-200"
                                        }`}
                                        required
                                    />
                                    {taskErrors.estimatedHours && (
                                        <div className="text-red-500 text-xs sm:text-sm mt-1">{taskErrors.estimatedHours}</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowTaskForm(false);
                                        if (success) navigate("/companydashboard");
                                    }}
                                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-xs sm:text-sm md:text-base w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isTaskSubmitting}
                                    className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-xs sm:text-sm md:text-base ${
                                        isTaskSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                    } w-full sm:w-auto`}
                                >
                                    {isTaskSubmitting ? "Creating Task..." : "Create Task"}
                                </button>
                            </div>
                        </form>
                    )}

                    <p className="text-center text-xs sm:text-sm mt-4 sm:mt-6">
                        Once {isEditMode ? "updated" : "published"}, candidates can apply and complete any attached tasks or quizzes.
                    </p>
                </div>
            </div>
        </SidebarLayout>
    );
}