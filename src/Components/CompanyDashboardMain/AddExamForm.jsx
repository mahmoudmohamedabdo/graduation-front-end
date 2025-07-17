import React, { useState } from 'react';
import { SidebarLayout } from '../../layouts/SidebarLayout';
import { useParams, useNavigate } from 'react-router-dom';

export default function AddExamForm() {
  const { jobId } = useParams(); // Get jobId from URL
  const navigate = useNavigate();
  const profileId = localStorage.getItem('profileId');
  const [formData, setFormData] = useState({
    companyId: profileId ? parseInt(profileId) : null,
    jobId: parseInt(jobId),
    title: '',
    description: '',
    instructions: '',
    durationMinutes: '',
    totalScore: '',
    passingScore: '',
    startDate: '',
    endDate: '',
    showResultsImmediately: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    validateField(name, type === 'checkbox' ? checked : value);
  };

  const validateField = (name, value) => {
    let fieldErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          fieldErrors.title = 'Exam Title is required';
        } else if (value.trim().length < 3 || value.trim().length > 256) {
          fieldErrors.title = 'Exam Title must be between 3 and 256 characters';
        } else {
          delete fieldErrors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          fieldErrors.description = 'Exam Description is required';
        } else if (value.trim().length < 10 || value.trim().length > 2000) {
          fieldErrors.description = 'Exam Description must be between 10 and 2,000 characters';
        } else {
          delete fieldErrors.description;
        }
        break;
      case 'instructions':
        if (!value.trim()) {
          fieldErrors.instructions = 'Exam Instructions are required';
        } else if (value.trim().length < 10 || value.trim().length > 2000) {
          fieldErrors.instructions = 'Exam Instructions must be between 10 and 2,000 characters';
        } else {
          delete fieldErrors.instructions;
        }
        break;
      case 'durationMinutes':
        if (!value) {
          fieldErrors.durationMinutes = 'Duration is required';
        } else if (!/^\d+$/.test(value) || parseInt(value) <= 0 || parseInt(value) > 1440) {
          fieldErrors.durationMinutes = 'Duration must be a positive integer between 1 and 1440 minutes';
        } else {
          delete fieldErrors.durationMinutes;
        }
        break;
      case 'totalScore':
        if (!value) {
          fieldErrors.totalScore = 'Total Score is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0) {
          fieldErrors.totalScore = 'Total Score must be a positive number';
        } else {
          delete fieldErrors.totalScore;
        }
        break;
      case 'passingScore':
        if (!value) {
          fieldErrors.passingScore = 'Passing Score is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(value) || parseFloat(value) <= 0) {
          fieldErrors.passingScore = 'Passing Score must be a positive number';
        } else if (formData.totalScore && parseFloat(value) > parseFloat(formData.totalScore)) {
          fieldErrors.passingScore = 'Passing Score cannot be greater than Total Score';
        } else {
          delete fieldErrors.passingScore;
        }
        break;
      case 'startDate':
        if (!value) {
          fieldErrors.startDate = 'Start Date is required';
        } else {
          const startDate = new Date(value);
          const now = new Date();
          now.setHours(now.getHours() + 1);
          if (startDate <= now) {
            fieldErrors.startDate = 'Start Date must be at least one hour in the future';
          } else {
            delete fieldErrors.startDate;
          }
        }
        break;
      case 'endDate':
        if (!value) {
          fieldErrors.endDate = 'End Date is required';
        } else {
          const endDate = new Date(value);
          const startDate = new Date(formData.startDate);
          if (endDate <= startDate) {
            fieldErrors.endDate = 'End Date must be after Start Date';
          } else {
            delete fieldErrors.endDate;
          }
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
      fieldErrors.title = 'Exam Title is required';
    } else if (formData.title.trim().length < 3 || formData.title.trim().length > 256) {
      fieldErrors.title = 'Exam Title must be between 3 and 256 characters';
    }

    if (!formData.description.trim()) {
      fieldErrors.description = 'Exam Description is required';
    } else if (formData.description.trim().length < 10 || formData.description.trim().length > 2000) {
      fieldErrors.description = 'Exam Description must be between 10 and 2,000 characters';
    }

    if (!formData.instructions.trim()) {
      fieldErrors.instructions = 'Exam Instructions are required';
    } else if (formData.instructions.trim().length < 10 || formData.instructions.trim().length > 2000) {
      fieldErrors.instructions = 'Exam Instructions must be between 10 and 2,000 characters';
    }

    if (!formData.durationMinutes) {
      fieldErrors.durationMinutes = 'Duration is required';
    } else if (!/^\d+$/.test(formData.durationMinutes) || parseInt(formData.durationMinutes) <= 0 || parseInt(formData.durationMinutes) > 1440) {
      fieldErrors.durationMinutes = 'Duration must be a positive integer between 1 and 1440 minutes';
    }

    if (!formData.totalScore) {
      fieldErrors.totalScore = 'Total Score is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.totalScore) || parseFloat(formData.totalScore) <= 0) {
      fieldErrors.totalScore = 'Total Score must be a positive number';
    }

    if (!formData.passingScore) {
      fieldErrors.passingScore = 'Passing Score is required';
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.passingScore) || parseFloat(formData.passingScore) <= 0) {
      fieldErrors.passingScore = 'Passing Score must be a positive number';
    } else if (parseFloat(formData.passingScore) > parseFloat(formData.totalScore)) {
      fieldErrors.passingScore = 'Passing Score cannot be greater than Total Score';
    }

    if (!formData.startDate) {
      fieldErrors.startDate = 'Start Date is required';
    } else {
      const startDate = new Date(formData.startDate);
      const now = new Date();
      now.setHours(now.getHours() + 1);
      if (startDate <= now) {
        fieldErrors.startDate = 'Start Date must be at least one hour in the future';
      }
    }

    if (!formData.endDate) {
      fieldErrors.endDate = 'End Date is required';
    } else {
      const endDate = new Date(formData.endDate);
      const startDate = new Date(formData.startDate);
      if (endDate <= startDate) {
        fieldErrors.endDate = 'End Date must be after Start Date';
      }
    }

    if (!formData.companyId || formData.companyId <= 0) {
      fieldErrors.companyId = 'A valid Company ID is required';
    }

    if (!formData.jobId || formData.jobId <= 0) {
      fieldErrors.jobId = 'A valid Job ID is required';
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
          companyId: formData.companyId,
          jobId: formData.jobId,
          title: formData.title,
          description: formData.description,
          instructions: formData.instructions,
          durationMinutes: parseInt(formData.durationMinutes),
          totalScore: parseFloat(formData.totalScore),
          passingScore: parseFloat(formData.passingScore),
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          showResultsImmediately: formData.showResultsImmediately,
        };

        console.log('Sending exam payload:', JSON.stringify(payload, null, 2));

        const response = await fetch('http://fit4job.runasp.net/api/Exams', {
          method: 'POST',
          headers: {
            accept: 'text/plain',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Exam API Error Details:', JSON.stringify(errorData, null, 2));
          const errorMessage = errorData.message || `Failed to create exam: ${response.statusText}`;
          if (errorData.errors) {
            const fieldErrors = {};
            Object.keys(errorData.errors).forEach((key) => {
              fieldErrors[key.toLowerCase()] = errorData.errors[key].join(', ');
            });
            setErrors(fieldErrors);
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log('Created exam response:', result);

        if (result.success) {
          setSuccess(true);
          setFormData({
            companyId: profileId ? parseInt(profileId) : null,
            jobId: parseInt(jobId),
            title: '',
            description: '',
            instructions: '',
            durationMinutes: '',
            totalScore: '',
            passingScore: '',
            startDate: '',
            endDate: '',
            showResultsImmediately: true,
          });
          navigate('/companydashboard');
        } else {
          throw new Error(result.message || 'Unknown error during exam creation');
        }
      } catch (err) {
        setErrors({ general: err.message });
        console.error('Exam API Error:', err.message);
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
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6">Create Exam</h2>

          {errors.general && <div className="text-red-500 mb-2 sm:mb-4">{errors.general}</div>}
          {success && <div className="text-green-500 mb-2 sm:mb-4">Exam created successfully!</div>}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Exam Title * (3-256 characters)
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={(e) => validateField('title', e.target.value)}
                placeholder="Technical Assessment"
                className={`w-full rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#F7F7F7] text-gray-900 border ${
                  errors.title ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.title && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.title.length}/256 characters</div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Exam Description * (10-2,000 characters)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={(e) => validateField('description', e.target.value)}
                rows="3"
                placeholder="Describe the exam in detail..."
                className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.description && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.description}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.description.length}/2,000 characters</div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                Exam Instructions * (10-2,000 characters)
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                onBlur={(e) => validateField('instructions', e.target.value)}
                rows="3"
                placeholder="Instructions for candidates taking the exam..."
                className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base bg-[#f7f7f7] text-gray-900 ${
                  errors.instructions ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.instructions && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.instructions}</div>}
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{formData.instructions.length}/2,000 characters</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Duration (Minutes) *
                </label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={formData.durationMinutes}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('durationMinutes', e.target.value)}
                  placeholder="60"
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                    errors.durationMinutes ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.durationMinutes && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.durationMinutes}</div>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Total Score *
                </label>
                <input
                  type="number"
                  name="totalScore"
                  value={formData.totalScore}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('totalScore', e.target.value)}
                  placeholder="100"
                  step="0.01"
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                    errors.totalScore ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.totalScore && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.totalScore}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Passing Score *
                </label>
                <input
                  type="number"
                  name="passingScore"
                  value={formData.passingScore}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('passingScore', e.target.value)}
                  placeholder="70"
                  step="0.01"
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                    errors.passingScore ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.passingScore && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.passingScore}</div>}
              </div>
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Start Date *
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  onBlur={(e) => validateField('startDate', e.target.value)}
                  className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                    errors.startDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.startDate && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.startDate}</div>}
              </div>
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                End Date *
              </label>
              <input
                type="datetime-local"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                onBlur={(e) => validateField('endDate', e.target.value)}
                className={`w-full border rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base text-gray-900 bg-[#f7f7f7] ${
                  errors.endDate ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.endDate && <div className="text-red-500 text-xs sm:text-sm mt-1">{errors.endDate}</div>}
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="flex items-center text-xs sm:text-sm md:text-base font-medium text-gray-700">
                <input
                  type="checkbox"
                  name="showResultsImmediately"
                  checked={formData.showResultsImmediately}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                Show Results Immediately
              </label>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
              <button
                type="button"
                onClick={() => navigate('/companydashboard')}
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 text-xs sm:text-sm md:text-base w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm md:text-base ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } w-full sm:w-auto`}
              >
                {isSubmitting ? 'Creating Exam...' : 'Create Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}