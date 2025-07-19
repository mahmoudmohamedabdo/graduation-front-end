import React, { useState, useEffect, Component } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import profile from '../assets/Images/profile.png';
import { FaGithub } from "react-icons/fa";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { FaLinkedin } from "react-icons/fa";

// Error Boundary Component
class ProfileErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            An error occurred: {this.state.error?.message || 'Unknown error. Please try again.'}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    currentPosition: '',
    location: '',
    about: '',
    skills: [],
    cvFileUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    experienceYears: 0,
    expectedSalary: 0,
    email: '',
  });
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId');
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    if (!userId || !authToken) {
      setError('Please log in to view your profile.');
      navigate('/login', { replace: true });
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/current`, {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Unauthorized: Please log in again.');
            localStorage.removeItem('authToken');
            navigate('/login', { replace: true });
            return;
          }
          throw new Error('Failed to fetch profile data.');
        }

        const result = await response.json();
        console.log('Profile API Response:', JSON.stringify(result, null, 2));

        if (result.success && result.data) {
          setUserProfile(result.data);
          setFormData({
            fullName: result.data.fullName || '',
            currentPosition: result.data.currentPosition || '',
            location: result.data.location || '',
            about: result.data.about || '',
            skills: Array.isArray(result.data.skills) ? result.data.skills : [],
            cvFileUrl: result.data.cvFileUrl || '',
            githubUrl: result.data.githubUrl || '',
            linkedinUrl: result.data.linkedinUrl || '',
            portfolioUrl: result.data.portfolioUrl || '',
            experienceYears: result.data.experienceYears || 0,
            expectedSalary: result.data.expectedSalary || 0,
            email: result.data.email || '',
          });
          setError(null);
        } else if (result.message === 'Profile not found.') {
          setIsCreatingProfile(true);
          setError('No profile found. Please create your profile below.');
        } else {
          throw new Error(result.message || 'No profile data found.');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message);
        if (err.message.includes('Profile not found')) {
          setIsCreatingProfile(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, authToken, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map((skill) => skill.trim()).filter((skill) => skill);
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!userId || !authToken) {
      setError('Please log in to create a profile.');
      navigate('/login');
      return;
    }

    const payload = {
      fullName: formData.fullName || 'Unknown',
      currentPosition: formData.currentPosition || '',
      location: formData.location || '',
      about: formData.about || '',
      skills: formData.skills || [],
      cvFileUrl: formData.cvFileUrl || '',
      githubUrl: formData.githubUrl || '',
      linkedinUrl: formData.linkedinUrl || '',
      portfolioUrl: formData.portfolioUrl || '',
      experienceYears: parseInt(formData.experienceYears) || 0,
      expectedSalary: parseInt(formData.expectedSalary) || 0,
      email: formData.email || '',
    };

    try {
      setLoading(true);
      setError(null);
      let response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/${userId}`, {
        method: 'PUT',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status === 405) {
        console.log('PUT failed with 405, trying POST...');
        response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/${userId}`, {
          method: 'POST',
          headers: {
            accept: 'text/plain',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login', { replace: true });
          return;
        }
        try {
          const result = await response.json();
          setError(
            `${result.message || 'Failed to create profile.'} (Request ID: ${
              result.requestId || 'unknown'
            }) Please contact support with this Request ID.`
          );
        } catch (jsonErr) {
          setError(
            `Invalid response from server. Please contact support with Request ID: unknown. (Status: ${response.status})`
          );
        }
        return;
      }

      const result = await response.json();
      console.log('Profile Creation Response:', JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        setUserProfile(result.data);
        setFormData({
          ...formData,
          skills: Array.isArray(result.data.skills) ? result.data.skills : [],
        });
        setIsCreatingProfile(false);
        setError(null);
      } else {
        setError(
          `${result.message || 'Failed to create profile.'} (Request ID: ${
            result.requestId || 'unknown'
          }) Please contact support with this Request ID.`
        );
      }
    } catch (err) {
      console.error('Error creating profile:', err);
      setError(`Network error: Could not create profile. ${err.message} Please contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!userId || !authToken) {
      setError('Please log in to update your profile.');
      navigate('/login');
      return;
    }

    const payload = {
      fullName: formData.fullName || 'Unknown',
      currentPosition: formData.currentPosition || '',
      location: formData.location || '',
      about: formData.about || '',
      skills: formData.skills || [],
      cvFileUrl: formData.cvFileUrl || '',
      githubUrl: formData.githubUrl || '',
      linkedinUrl: formData.linkedinUrl || '',
      portfolioUrl: formData.portfolioUrl || '',
      experienceYears: parseInt(formData.experienceYears) || 0,
      expectedSalary: parseInt(formData.expectedSalary) || 0,
      email: formData.email || '',
    };

    try {
      setLoading(true);
      setError(null);
      let response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/${userId}`, {
        method: 'PUT',
        headers: {
          accept: 'text/plain',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok && response.status === 405) {
        console.log('PUT failed with 405, trying POST...');
        response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/${userId}`, {
          method: 'POST',
          headers: {
            accept: 'text/plain',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login', { replace: true });
          return;
        }
        try {
          const result = await response.json();
          setError(
            `${result.message || 'Failed to update profile.'} (Request ID: ${
              result.requestId || 'unknown'
            }) Please contact support with this Request ID.`
          );
        } catch (jsonErr) {
          setError(
            `Invalid response from server. Please contact support with Request ID: unknown. (Status: ${response.status})`
          );
        }
        return;
      }

      const result = await response.json();
      console.log('Profile Update Response:', JSON.stringify(result, null, 2));

      if (result.success && result.data) {
        setUserProfile({ ...userProfile, ...payload });
        setFormData({
          ...formData,
          skills: Array.isArray(result.data.skills) ? result.data.skills : [],
        });
        setError(null);
        alert('Profile updated successfully!');
      } else {
        setError(
          `${result.message || 'Failed to update profile.'} (Request ID: ${
            result.requestId || 'unknown'
          }) Please contact support with this Request ID.`
        );
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(`Network error: Could not update profile. ${err.message} Please contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or Word document.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://fit4job.runasp.net/api/JobSeekerProfile/current/cv`, {
        method: 'POST',
        headers: {
          accept: 'text/plain',
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Unauthorized: Please log in again.');
          localStorage.removeItem('authToken');
          navigate('/login', { replace: true });
          return;
        }
        try {
          const result = await response.json();
          setError(
            `${result.message || 'Failed to upload resume.'} (Request ID: ${
              result.requestId || 'unknown'
            }) Please contact support with this Request ID.`
          );
        } catch (jsonErr) {
          setError(
            `Invalid response from server. Please contact support with Request ID: unknown. (Status: ${response.status})`
          );
        }
        return;
      }

      const result = await response.json();
      console.log('CV Upload Response:', JSON.stringify(result, null, 2));

      if (result.success && result.data?.cvFileUrl) {
        setUserProfile({ ...userProfile, cvFileUrl: result.data.cvFileUrl });
        setFormData({ ...formData, cvFileUrl: result.data.cvFileUrl });
        setError(null);
        alert('Resume uploaded successfully!');
      } else {
        setError(
          `${result.message || 'Failed to upload resume.'} (Request ID: ${
            result.requestId || 'unknown'
          }) Please contact support with this Request ID.`
        );
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(`Network error: Could not upload resume. ${err.message} Please contact support.`);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGithub = () => {
    console.log('GitHub connect clicked');
  };

  const handleConnectLinkedin = () => {
    console.log('LinkedIn connect clicked');
  };

  return (
    <ProfileErrorBoundary>
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
          {loading ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <p className="text-gray-600 text-lg">Loading...</p>
            </div>
          ) : error && !userProfile && !isCreatingProfile ? (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {error}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              {isCreatingProfile ? (
                <>
                  <h2 className="text-lg font-bold mb-4 text-gray-900">Create Your Profile</h2>
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleCreateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Current Position</label>
                      <input
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">About</label>
                      <textarea
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                      <input
                        type="text"
                        name="skills"
                        value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                        onChange={handleSkillsChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        placeholder="e.g., Java, Python, SQL"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Experience Years</label>
                      <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Expected Salary</label>
                      <input
                        type="number"
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                      <input
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                      <input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Profile'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center px-4 py-8 w-full max-w-4xl">
                  {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile} className="w-full space-y-6">
                    <div className="flex flex-col items-center text-center">
                      <img
                        src={userProfile?.profileImageUrl || profile}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover shadow"
                      />
                      <h1 className="text-lg font-semibold mt-4 text-gray-900">{userProfile?.fullName || 'No Name'}</h1>
                      <input
                        type="text"
                        name="currentPosition"
                        value={formData.currentPosition}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-2"
                        placeholder="Current Position"
                      />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm mt-1"
                        placeholder="Location"
                      />
                    </div>

                    <div className="mt-8 w-full space-y-6">
                      <section>
                        <h2 className="text-sm font-bold mb-1 text-gray-900">About</h2>
                        <textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
                          rows={4}
                          placeholder="About you"
                        />
                      </section>

                      <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">Skills</h2>
                        <input
                          type="text"
                          name="skills"
                          value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                          onChange={handleSkillsChange}
                          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                          placeholder="e.g., Java, Python, SQL"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(Array.isArray(formData.skills) && formData.skills.length > 0) ? (
                            formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="bg-[#F0F2F5] text-[#121417] text-xs px-3 py-[3px] rounded-full"
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-sm text-gray-600">No skills listed.</p>
                          )}
                        </div>
                      </section>

                      <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">Resume</h2>
                        <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HiOutlineDocumentArrowUp />
                            <span className="text-sm text-gray-800">
                              {formData.cvFileUrl ? 'Resume Uploaded' : 'Upload Resume'}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleUploadResume}
                            className="text-sm"
                          />
                        </div>
                      </section>

                      <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">External Profiles</h2>
                        <div className="space-y-2">
                          <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaGithub />
                              <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="GitHub URL"
                              />
                            </div>
                            <button
                              type="button"
                              className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded"
                              onClick={handleConnectGithub}
                            >
                              {formData.githubUrl ? 'Update' : 'Connect'}
                            </button>
                          </div>
                          <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaLinkedin />
                              <input
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="LinkedIn URL"
                              />
                            </div>
                            <button
                              type="button"
                              className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded"
                              onClick={handleConnectLinkedin}
                            >
                              {formData.linkedinUrl ? 'Update' : 'Connect'}
                            </button>
                          </div>
                          <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-800">Portfolio</span>
                              <input
                                type="url"
                                name="portfolioUrl"
                                value={formData.portfolioUrl}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="Portfolio URL"
                              />
                            </div>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h2 className="text-sm font-bold mb-1 text-gray-900">Exam Attempts</h2>
                        <p className="text-sm text-gray-600">
                          You have {userProfile?.userCredit || 0} attempts per track. Use them wisely to showcase your skills.
                        </p>
                      </section>

                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProfileErrorBoundary>
  );
}