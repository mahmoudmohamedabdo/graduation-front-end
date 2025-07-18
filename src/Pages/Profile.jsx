import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/Navbar";
import profile from "../assets/Images/profile.png";
import { FaGithub } from "react-icons/fa";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { FaLinkedin } from "react-icons/fa";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    experienceYears: "",
    currentPosition: "",
    expectedSalary: "",
    location: "",
    description: "",
  });
  const [updateStatus, setUpdateStatus] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const userId = localStorage.getItem("userId");
  const fullName = localStorage.getItem("fullName");
  const profileId = localStorage.getItem("profileId") || userId;
  const navigate = useNavigate();

  // Move fetchProfile outside useEffect
  const fetchProfile = async () => {
    if (!userId || !profileId) {
      setError("No user ID or profile ID found. Please log in to view your profile.");
      setLoading(false);
      if (fullName) {
        const [firstName = "", lastName = ""] = fullName.split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
        }));
      }
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching profile with:", { userId, profileId, token: token ? "Present" : "Missing" });

      const response = await axios.get(
        `http://fit4job.runasp.net/api/JobSeekerProfiles/${profileId}`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Profile Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.data) {
        setProfileData(response.data.data);
        const [firstName = "", lastName = ""] = fullName
          ? fullName.split(" ")
          : response.data.data.fullName
          ? response.data.data.fullName.split(" ")
          : ["", ""];
        setFormData({
          firstName,
          lastName,
          linkedinUrl: response.data.data.linkedinUrl || "",
          githubUrl: response.data.data.githubUrl || "",
          portfolioUrl: response.data.data.portfolioUrl || "",
          experienceYears: response.data.data.experienceYears || "",
          currentPosition: response.data.data.currentPosition || "",
          expectedSalary: response.data.data.expectedSalary || "",
          location: response.data.data.location || "",
          description: response.data.data.description || "",
        });
        console.log("📸 Current Profile Image URL:", profileData?.profileImageUrl || profile);
        setError(null);
      } else {
        setError(
          `${response.data.message || "Failed to fetch profile data."} (Request ID: ${
            response.data.requestId || "unknown"
          })`
        );
      }
    } catch (err) {
      console.error("❌ Error fetching profile:", {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        } : null,
        stack: err.stack,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Session expired or access denied. Please log in again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response) {
        setError(
          `${err.response.data.message || "Failed to fetch profile data."} (Request ID: ${
            err.response.data.requestId || "unknown"
          })`
        );
      } else {
        setError(`Network error: Could not fetch profile data. ${err.message}`);
      }
      if (fullName) {
        const [firstName = "", lastName = ""] = fullName.split(" ");
        setFormData((prev) => ({
          ...prev,
          firstName,
          lastName,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileId, fullName, userId, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setUpdateStatus(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!userId || !profileId) {
      setUpdateStatus({ type: "error", message: "No user ID or profile ID found. Please log in." });
      return;
    }
    if (!formData.firstName || !formData.lastName) {
      setUpdateStatus({ type: "error", message: "First name and last name are required." });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setUpdateStatus({
        type: "error",
        message: "No authentication token found. Please log in again.",
      });
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      linkedinUrl: formData.linkedinUrl,
      githubUrl: formData.githubUrl,
      portfolioUrl: formData.portfolioUrl,
      experienceYears: parseInt(formData.experienceYears) || 0,
      currentPosition: formData.currentPosition,
      expectedSalary: parseFloat(formData.expectedSalary) || 0,
      location: formData.location,
      description: formData.description,
    };

    try {
      setLoading(true);
      setUpdateStatus(null);

      console.log("📦 Update Profile Payload:", JSON.stringify(payload, null, 2));
      console.log("Using profileId:", profileId);

      const response = await axios.put(
        `http://fit4job.runasp.net/api/JobSeekerProfiles/${profileId}`,
        payload,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Update Profile Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        setProfileData({
          ...profileData,
          ...payload,
          fullName: `${formData.firstName} ${formData.lastName}`,
        });
        setUpdateStatus({ type: "success", message: "Profile updated successfully!" });
        setIsEditing(false);
        localStorage.setItem("fullName", `${formData.firstName} ${formData.lastName}`);
      } else {
        setUpdateStatus({
          type: "error",
          message: `${response.data.message || "Failed to update profile."} (Request ID: ${
            response.data.requestId || "unknown"
          })`,
        });
      }
    } catch (err) {
      console.error("❌ Error updating profile:", {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        } : null,
        stack: err.stack,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUpdateStatus({
          type: "error",
          message: "Session expired or access denied. Please log in again.",
        });
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response) {
        setUpdateStatus({
          type: "error",
          message: `${err.response.data.message || "Failed to update profile."} (Request ID: ${
            err.response.data.requestId || "unknown"
          })`,
        });
      } else {
        setUpdateStatus({
          type: "error",
          message: `Network error: Could not update profile. ${err.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfilePicture(file);
      setUpdateStatus(null);
    } else {
      setUpdateStatus({ type: "error", message: "Please select a valid image file." });
      setProfilePicture(null);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!profilePicture) {
      setUpdateStatus({ type: "error", message: "Please select a profile picture to upload." });
      return;
    }

    if (!userId || !profileId) {
      setUpdateStatus({ type: "error", message: "No user ID or profile ID found. Please log in." });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setUpdateStatus({
        type: "error",
        message: "No authentication token found. Please log in again.",
      });
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", profilePicture);

    try {
      setLoading(true);
      setUpdateStatus(null);

      console.log("Uploading profile picture for:", { profileId, file: profilePicture.name });

      const response = await axios.put(
        `http://fit4job.runasp.net/api/JobSeekerProfiles/profile/picture/${profileId}`,
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Upload Profile Picture Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        const newImageUrl = response.data.data?.profileImageUrl || URL.createObjectURL(profilePicture);
        
        if (response.data.data) {
          setProfileData(response.data.data);
        } else {
          setProfileData((prev) => ({
            ...prev,
            profileImageUrl: newImageUrl,
          }));
        }

        console.log("📸 New Profile Image URL:", newImageUrl);
        setUpdateStatus({ type: "success", message: "Profile picture uploaded successfully!" });
        setProfilePicture(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setUpdateStatus({
          type: "error",
          message: `${response.data.message || "Failed to upload profile picture."} (Request ID: ${
            response.data.requestId || "unknown"
          })`,
        });
      }
    } catch (err) {
      console.error("❌ Error uploading profile picture:", {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        } : null,
        stack: err.stack,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUpdateStatus({
          type: "error",
          message: "Session expired or access denied. Please log in again.",
        });
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response) {
        setUpdateStatus({
          type: "error",
          message: `${err.response.data.message || "Failed to upload profile picture."} (Request ID: ${
            err.response.data.requestId || "unknown"
          })`,
        });
      } else {
        setUpdateStatus({
          type: "error",
          message: `Network error: Could not upload profile picture. ${err.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(file);
      setUpdateStatus(null);
    } else {
      setUpdateStatus({ type: "error", message: "Please select a valid PDF or Word document." });
      setResumeFile(null);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setUpdateStatus({ type: "error", message: "Please select a resume to upload." });
      return;
    }

    if (!userId || !profileId) {
      setUpdateStatus({ type: "error", message: "No user ID or profile ID found. Please log in." });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setUpdateStatus({
        type: "error",
        message: "No authentication token found. Please log in again.",
      });
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("file", resumeFile);

    try {
      setLoading(true);
      setUpdateStatus(null);

      console.log("Uploading resume for:", { profileId, file: resumeFile.name });

      const response = await axios.post(
        `http://fit4job.runasp.net/api/JobSeekerProfiles/current/cv`,
        formData,
        {
          headers: {
            accept: "text/plain",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Upload Resume Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        // Refetch profile to ensure cvFileUrl is updated
        await fetchProfile();
        setUpdateStatus({ type: "success", message: "Resume uploaded successfully!" });
        setResumeFile(null);
        if (resumeInputRef.current) {
          resumeInputRef.current.value = "";
        }
      } else {
        setUpdateStatus({
          type: "error",
          message: `${response.data.message || "Failed to upload resume."} (Request ID: ${
            response.data.requestId || "unknown"
          })`,
        });
      }
    } catch (err) {
      console.error("❌ Error uploading resume:", {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        } : null,
        stack: err.stack,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUpdateStatus({
          type: "error",
          message: "Session expired or access denied. Please log in again.",
        });
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response) {
        setUpdateStatus({
          type: "error",
          message: `${err.response.data.message || "Failed to upload resume."} (Request ID: ${
            err.response.data.requestId || "unknown"
          })`,
        });
      } else {
        setUpdateStatus({
          type: "error",
          message: `Network error: Could not upload resume. ${err.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!userId || !profileId) {
      setUpdateStatus({ type: "error", message: "No user ID or profile ID found. Please log in." });
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setUpdateStatus({
        type: "error",
        message: "No authentication token found. Please log in again.",
      });
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setUpdateStatus(null);

      console.log("Deleting resume for:", { profileId });

      const response = await axios.delete(
        `http://fit4job.runasp.net/api/JobSeekerProfiles/current/cv`,
        {
          headers: {
            accept: "text/plain",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Delete Resume Response:", JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        // Refetch profile to ensure cvFileUrl is cleared
        await fetchProfile();
        setUpdateStatus({ type: "success", message: "Resume deleted successfully!" });
      } else {
        setUpdateStatus({
          type: "error",
          message: `${response.data.message || "Failed to delete resume."} (Request ID: ${
            response.data.requestId || "unknown"
          })`,
        });
      }
    } catch (err) {
      console.error("❌ Error deleting resume:", {
        message: err.message,
        code: err.code,
        response: err.response ? {
          status: err.response.status,
          statusText: err.response.statusText,
          data: err.response.data,
        } : null,
        stack: err.stack,
      });
      if (err.response?.status === 401 || err.response?.status === 403) {
        setUpdateStatus({
          type: "error",
          message: "Session expired or access denied. Please log in again.",
        });
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response) {
        setUpdateStatus({
          type: "error",
          message: `${err.response.data.message || "Failed to delete resume."} (Request ID: ${
            err.response.data.requestId || "unknown"
          })`,
        });
      } else {
        setUpdateStatus({
          type: "error",
          message: `Network error: Could not delete resume. ${err.message}`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-sm">{error}</p>
            {(error.includes("Please log in") || error.includes("access denied")) && (
              <button
                onClick={() => navigate("/login")}
                className="mt-2 bg-[#2563EB] text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-700"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center relative">
          <div className="relative">
            <img
              src={profileData?.profileImageUrl || profile}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover shadow"
            />
            {!isEditing && (
              <HiOutlineDocumentArrowUp
                className="absolute top-0 right-0 w-6 h-6 text-blue-600 bg-white rounded-full p-1 shadow cursor-pointer"
                title="Change profile picture"
                onClick={() => fileInputRef.current?.click()}
              />
            )}
          </div>
          <h1 className="text-lg font-semibold mt-4 text-gray-900">
            {profileData?.fullName || fullName || "Unknown User"}
          </h1>
          <p className="text-sm text-gray-600">
            {profileData?.currentPosition || "No Position"}
          </p>
          <p className="text-sm mt-1">{profileData?.location || "No Location"}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleEditToggle}
              className="bg-[#2563EB] text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-700"
            >
              {isEditing ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>
          {updateStatus && (
            <p
              className={`mt-2 text-sm ${
                updateStatus.type === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {updateStatus.message}
            </p>
          )}
          {updateStatus?.message.includes("Please log in") && (
            <button
              onClick={() => navigate("/login")}
              className="mt-2 bg-[#2563EB] text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-700"
            >
              Go to Login
            </button>
          )}
          {!isEditing && (
            <div className="mt-4 flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="text-sm text-gray-600"
                style={{ display: "none" }}
                id="profilePictureInput"
                ref={fileInputRef}
              />
              <label
                htmlFor="profilePictureInput"
                className="bg-gray-100 text-gray-800 rounded-lg px-4 py-1 text-sm hover:bg-gray-200 cursor-pointer"
              >
                Choose Picture
              </label>
              <button
                onClick={handleUploadProfilePicture}
                className="bg-green-600 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-700 disabled:opacity-50"
                disabled={loading || !profilePicture}
              >
                {loading ? "Uploading..." : "Upload Picture"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 w-full max-w-4xl space-y-6">
          {isEditing ? (
            <section>
              <h2 className="text-sm font-bold mb-2 text-gray-900">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
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
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                    rows="4"
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
                  <label className="block text-sm font-medium text-gray-700">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolioUrl"
                    value={formData.portfolioUrl}
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
                    step="0.01"
                  />
                </div>
                {updateStatus && (
                  <p
                    className={`text-sm ${
                      updateStatus.type === "error" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {updateStatus.message}
                  </p>
                )}
                {updateStatus?.message.includes("Please log in") && (
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="w-full bg-[#2563EB] text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-700"
                  >
                    Go to Login
                  </button>
                )}
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    className="bg-gray-200 text-gray-800 rounded-lg px-4 py-1 text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2563EB] text-white rounded-lg px-4 py-1 text-sm hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <>
              {/* About */}
              <section>
                <h2 className="text-sm font-bold mb-1 text-gray-900">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {profileData?.description ||
                    "No description provided. Add one to share more about yourself."}
                </p>
              </section>

              {/* Additional Profile Info */}
              <section>
                <h2 className="text-sm font-bold mb-2 text-gray-900">Profile Details</h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">LinkedIn:</span>{" "}
                    {profileData?.linkedinUrl ? (
                      <a
                        href={profileData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profileData.linkedinUrl}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">GitHub:</span>{" "}
                    {profileData?.githubUrl ? (
                      <a
                        href={profileData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profileData.githubUrl}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Portfolio:</span>{" "}
                    {profileData?.portfolioUrl ? (
                      <a
                        href={profileData.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {profileData.portfolioUrl}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Experience Years:</span>{" "}
                    {profileData?.experienceYears || "Not provided"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Expected Salary:</span>{" "}
                    {profileData?.expectedSalary
                      ? `$${parseFloat(profileData.expectedSalary).toLocaleString()}`
                      : "Not provided"}
                  </p>
                </div>
              </section>

              {/* Skills */}
              <section>
                <h2 className="text-sm font-bold mb-2 text-gray-900">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {["Java", "Python", "SQL", "AWS", "Agile", "Problem Solving"].map((skill) => (
                    <span
                      key={skill}
                      className="bg-[#F0F2F5] text-[#121417] text-xs px-3 py-[3px] rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Resume Upload */}
              <section>
                <h2 className="text-sm font-bold mb-2 text-gray-900">Resume</h2>
                <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiOutlineDocumentArrowUp />
                    <span className="text-sm text-gray-800">
                      {profileData?.cvFileUrl ? "Resume Uploaded" : "Upload Resume"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="text-sm text-gray-600"
                      style={{ display: "none" }}
                      id="resumeInput"
                      ref={resumeInputRef}
                    />
                    <label
                      htmlFor="resumeInput"
                      className="bg-gray-100 text-gray-800 rounded-lg px-4 py-1 text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      Choose File
                    </label>
                    <button
                      onClick={handleUploadResume}
                      className="bg-green-600 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-700 disabled:opacity-50"
                      disabled={loading || !resumeFile}
                    >
                      {loading ? "Uploading..." : "Upload Resume"}
                    </button>
                    {profileData?.cvFileUrl && (
                      <button
                        onClick={handleDeleteResume}
                        className="bg-red-600 text-white rounded-lg px-4 py-1 text-sm hover:bg-red-700 disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete Resume"}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* External Profiles */}
              <section>
                <h2 className="text-sm font-bold mb-2 text-gray-900">External Profiles</h2>
                <div className="space-y-2">
                  <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaGithub />
                      <span className="text-sm text-gray-800">
                        {profileData?.githubUrl ? "GitHub Connected" : "GitHub"}
                      </span>
                    </div>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded"
                      disabled={!!profileData?.githubUrl}
                    >
                      {profileData?.githubUrl ? "Connected" : "Connect"}
                    </button>
                  </div>
                  <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaLinkedin />
                      <span className="text-sm text-gray-800">
                        {profileData?.linkedinUrl ? "LinkedIn Connected" : "LinkedIn"}
                      </span>
                    </div>
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded"
                      disabled={!!profileData?.linkedinUrl}
                    >
                      {profileData?.linkedinUrl ? "Connected" : "Connect"}
                    </button>
                  </div>
                </div>
              </section>

              {/* Exam Attempts */}
              <section>
                <h2 className="text-sm font-bold mb-1 text-gray-900">Exam Attempts</h2>
                <p className="text-sm text-gray-600">
                  You have 5 attempts per track. Use them wisely to showcase your skills.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}