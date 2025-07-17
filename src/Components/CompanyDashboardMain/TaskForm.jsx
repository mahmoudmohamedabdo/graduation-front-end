import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TaskForm = ({ jobId, onTaskCreated, onClose }) => {
  const navigate = useNavigate();
  const { taskId } = useParams(); // Get task ID from route for editing
  const profileId = localStorage.getItem("profileId");
  const [taskData, setTaskData] = useState({
    companyId: profileId ? parseInt(profileId) : null,
    jobId: jobId || 0,
    title: "",
    description: "",
    requirements: "",
    deliverables: "",
    deadline: "",
    estimatedHours: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!taskId);

  // Fetch task data if in edit mode
  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await fetch(`http://fit4job.runasp.net/api/CompanyTasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
              "Content-Type": "application/json",
              accept: "text/plain",
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch task: ${response.statusText}`);
          }

          const result = await response.json();
          if (result.success && result.data) {
            const task = result.data;
            setTaskData({
              companyId: profileId ? parseInt(profileId) : null,
              jobId: task.jobId || jobId,
              title: task.title || "",
              description: task.description || "",
              requirements: task.requirements || "",
              deliverables: task.deliverables || "",
              deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : "",
              estimatedHours: task.estimatedHours || "",
            });
          } else {
            throw new Error("Invalid task data");
          }
        } catch (err) {
          setErrors({ general: err.message });
        }
      };
      fetchTask();
    }
  }, [taskId, jobId, profileId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  // Validate field
  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

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
    setErrors(fieldErrors);
  };

  // Validate entire form
  const validateForm = () => {
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

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setSuccess(false);

    if (validateForm()) {
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

        const endpoint = isEditMode
          ? `http://fit4job.runasp.net/api/CompanyTasks/${taskId}`
          : "http://fit4job.runasp.net/api/CompanyTasks";
        const method = isEditMode ? "PUT" : "POST";

        const response = await fetch(endpoint, {
          method,
          headers: {
            accept: "text/plain",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to ${isEditMode ? "update" : "create"} task: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          setSuccess(true);
          if (onTaskCreated) onTaskCreated();
          if (isEditMode) {
            navigate(`/job/${taskData.jobId}/tasks`); // Redirect to task list or dashboard
          } else {
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
            if (onClose) onClose();
          }
        } else {
          throw new Error(result.message || "Unknown error during task operation");
        }
      } catch (err) {
        setErrors({ general: err.message });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
      <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-4">
        {isEditMode ? "Edit Task" : "Add Task"}
      </h3>

      {errors.general && <div className="text-red-500 mb-2">{errors.general}</div>}
      {success && <div className="text-green-500 mb-2">Task {isEditMode ? "updated" : "created"} successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title * (3-256 characters)
          </label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            onBlur={(e) => validateField("title", e.target.value)}
            placeholder="Design a Website Mockup"
            className={`w-full rounded-md px-3 py-2 text-sm bg-[#F7F7F7] text-gray-900 border ${
              errors.title ? "border-red-500" : "border-gray-200"
            }`}
            required
          />
          {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
          <div className="text-xs text-gray-500 mt-1">{taskData.title.length}/256 characters</div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Description * (10-2,000 characters)
          </label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            onBlur={(e) => validateField("description", e.target.value)}
            rows="3"
            placeholder="Describe the task in detail..."
            className={`w-full border rounded-md px-3 py-2 text-sm bg-[#f7f7f7] text-gray-900 ${
              errors.description ? "border-red-500" : "border-gray-200"
            }`}
            required
          />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
          <div className="text-xs text-gray-500 mt-1">{taskData.description.length}/2,000 characters</div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Requirements * (10-2,000 characters)
          </label>
          <textarea
            name="requirements"
            value={taskData.requirements}
            onChange={handleInputChange}
            onBlur={(e) => validateField("requirements", e.target.value)}
            rows="3"
            placeholder="Required skills or tools for the task..."
            className={`w-full border rounded-md px-3 py-2 text-sm bg-[#f7f7f7] text-gray-900 ${
              errors.requirements ? "border-red-500" : "border-gray-200"
            }`}
            required
          />
          {errors.requirements && <div className="text-red-500 text-xs mt-1">{errors.requirements}</div>}
          <div className="text-xs text-gray-500 mt-1">{taskData.requirements.length}/2,000 characters</div>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Deliverables * (10-2,000 characters)
          </label>
          <textarea
            name="deliverables"
            value={taskData.deliverables}
            onChange={handleInputChange}
            onBlur={(e) => validateField("deliverables", e.target.value)}
            rows="3"
            placeholder="Expected outputs or deliverables..."
            className={`w-full border rounded-md px-3 py-2 text-sm bg-[#f7f7f7] text-gray-900 ${
              errors.deliverables ? "border-red-500" : "border-gray-200"
            }`}
            required
          />
          {errors.deliverables && <div className="text-red-500 text-xs mt-1">{errors.deliverables}</div>}
          <div className="text-xs text-gray-500 mt-1">{taskData.deliverables.length}/2,000 characters</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deadline *
            </label>
            <input
              type="datetime-local"
              name="deadline"
              value={taskData.deadline}
              onChange={handleInputChange}
              onBlur={(e) => validateField("deadline", e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-[#f7f7f7] ${
                errors.deadline ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {errors.deadline && <div className="text-red-500 text-xs mt-1">{errors.deadline}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Hours *
            </label>
            <input
              type="number"
              name="estimatedHours"
              value={taskData.estimatedHours}
              onChange={handleInputChange}
              onBlur={(e) => validateField("estimatedHours", e.target.value)}
              placeholder="100"
              className={`w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-[#f7f7f7] ${
                errors.estimatedHours ? "border-red-500" : "border-gray-200"
              }`}
              required
            />
            {errors.estimatedHours && <div className="text-red-500 text-xs mt-1">{errors.estimatedHours}</div>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Task" : "Create Task")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;