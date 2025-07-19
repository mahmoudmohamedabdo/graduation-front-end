import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import edit from '../../assets/Images/Edit.png';
import {
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  UsersIcon,
  BriefcaseIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';
import { SidebarLayout } from '../../layouts/SidebarLayout';

export default function CompanyProfile() {
  const [coverImage, setCoverImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(true);
  const [coverImageLoading, setCoverImageLoading] = useState(false);
  const [profileImageLoading, setProfileImageLoading] = useState(false);
  const [coverImageTimeout, setCoverImageTimeout] = useState(false);
  const [profileImageTimeout, setProfileImageTimeout] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState();
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(''); // 'cover' or 'profile'
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [profileData, setProfileData] = useState({
    companyName: 'Company Name Not Set',
    companyDescription: 'No description available.',
    industry: 'Industry Not Specified',
    websiteUrl: 'Website not available',
    email: 'Email not available',
    phone: 'Phone not available',
    companySize: 'Company size not specified',
    foundingYear: 'Year not specified',
    linkedinUrl: ''
  });
  
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // Load saved images when component mounts
  useEffect(() => {
    loadSavedImages();
  }, []);

  // Spinner timeout logic for cover image
  useEffect(() => {
    let timer;
    if (coverImageLoading) {
      timer = setTimeout(() => setCoverImageTimeout(true), 4000);
    } else {
      setCoverImageTimeout(false);
    }
    return () => clearTimeout(timer);
  }, [coverImageLoading]);

  // Spinner timeout logic for profile image
  useEffect(() => {
    let timer;
    if (profileImageLoading) {
      timer = setTimeout(() => setProfileImageTimeout(true), 4000);
    } else {
      setProfileImageTimeout(false);
    }
    return () => clearTimeout(timer);
  }, [profileImageLoading]);

  // Default crop settings for cover image (1200x400 aspect ratio)
  const coverCropSettings = {
    unit: '%',
    width: 100,
    height: 33.33, // 1200:400 = 3:1 ratio
    x: 0,
    y: 0
  };

  // Default crop settings for profile image (1:1 aspect ratio)
  const profileCropSettings = {
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  };

  const handleCropComplete = (crop) => {
    setCrop(crop);
  };

  const uploadCroppedImage = async (imageDataUrl, type) => {
    try {
      const profileId = localStorage.getItem("profileId");
      const authToken = localStorage.getItem("authToken");
      
      if (!profileId || !authToken) {
        setUploadError('Profile ID or authentication token not found.');
        return;
      }

      // Convert base64 to blob
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      
      const formData = new FormData();
      if (type === 'cover') {
        formData.append('companyCoverPicture', blob, 'cover.jpg');
      } else {
        formData.append('companyProfilePicture', blob, 'profile.jpg');
      }

      const uploadResponse = await axios.put(
        `http://fit4job.runasp.net/api/CompanyProfiles/${type}/picture/${profileId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (uploadResponse.data && uploadResponse.data.success) {
        setUploadSuccess(`${type === 'cover' ? 'Cover' : 'Profile'} image uploaded successfully!`);
        setTimeout(() => setUploadSuccess(''), 3000);
      } else {
        setUploadError(`Failed to upload ${type} image.`);
        setTimeout(() => setUploadError(''), 3000);
      }
    } catch (error) {
      console.error(`Failed to upload ${type} image:`, error);
      setUploadError(`Failed to upload ${type} image. Please try again.`);
      setTimeout(() => setUploadError(''), 3000);
    }
  };

  const handleCropSave = () => {
    if (!crop || !imageToCrop) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
      
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
      
      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      
      // Update the appropriate image state
      if (cropType === 'cover') {
        setCoverImage(croppedImageUrl);
      } else if (cropType === 'profile') {
        setProfileImage(croppedImageUrl);
      }
      
      // Upload to server
      uploadCroppedImage(croppedImageUrl, cropType);
      
      setShowCropModal(false);
      setCrop(null);
      setImageToCrop(null);
      setCropType('');
    };
    
    image.src = imageToCrop;
  };

  const openCropModal = (imageSrc, type) => {
    setImageToCrop(imageSrc);
    setCropType(type);
    setCrop(type === 'cover' ? coverCropSettings : profileCropSettings);
    setShowCropModal(true);
  };

  const closeCropModal = () => {
    setShowCropModal(false);
    setCrop(null);
    setImageToCrop(null);
    setCropType('');
  };

  const loadSavedImages = async () => {
    try {
      const profileId = localStorage.getItem("profileId");
      const authToken = localStorage.getItem("authToken");
      
      if (!profileId || !authToken) {
        setLoading(false);
        return;
      }

      // Load company profile data from API
      const response = await axios.get(`http://fit4job.runasp.net/api/CompanyProfiles/${profileId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.data && response.data.success && response.data.data) {
        const data = response.data.data;
        
        // Update profile data
        setProfileData({
          companyName: data.companyName || 'Company Name Not Set',
          companyDescription: data.companyDescription || 'No description available.',
          industry: data.industry || 'Industry Not Specified',
          websiteUrl: data.websiteUrl || 'Website not available',
          email: data.email || 'Email not available',
          phone: data.phone || 'Phone not available',
          companySize: data.companySize ? `${data.companySize} employees` : 'Company size not specified',
          foundingYear: data.foundingYear ? data.foundingYear.toString() : 'Year not specified',
          linkedinUrl: data.linkedinUrl || ''
        });
        
        // Update images if they exist in the response
        if (data.coverPictureURL) {
          // Add base URL to the image path
          const fullCoverUrl = data.coverPictureURL.startsWith('http') 
            ? data.coverPictureURL 
            : `http://fit4job.runasp.net${data.coverPictureURL}`;
          setCoverImage(fullCoverUrl);
        } else {
          setCoverImage(null);
        }
        if (data.profilePictureURL) {
          // Add base URL to the image path
          const fullProfileUrl = data.profilePictureURL.startsWith('http') 
            ? data.profilePictureURL 
            : `http://fit4job.runasp.net${data.profilePictureURL}`;
          setProfileImage(fullProfileUrl);
        } else {
          setProfileImage(null);
        }
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImageLoading(true);
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('Cover image must be less than 5MB');
        setTimeout(() => setUploadError(''), 3000);
        setCoverImageLoading(false);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        setTimeout(() => setUploadError(''), 3000);
        setCoverImageLoading(false);
        return;
      }

      // Read file and open crop modal
      const reader = new FileReader();
      reader.onload = (e) => {
        openCropModal(e.target.result, 'cover');
        setCoverImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageLoading(true);
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('Profile image must be less than 2MB');
        setTimeout(() => setUploadError(''), 3000);
        setProfileImageLoading(false);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select a valid image file');
        setTimeout(() => setUploadError(''), 3000);
        setProfileImageLoading(false);
        return;
      }

      // Read file and open crop modal
      const reader = new FileReader();
      reader.onload = (e) => {
        openCropModal(e.target.result, 'profile');
        setProfileImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCoverUpload = () => {
    coverInputRef.current?.click();
  };

  const triggerProfileUpload = () => {
    profileInputRef.current?.click();
  };

  const openEditModal = () => {
    setShowEditModal(true);
    setEditSuccess('');
    setEditError('');
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditSuccess('');
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess('');
    setEditError('');

    try {
      const profileId = localStorage.getItem("profileId");
      const authToken = localStorage.getItem("authToken");
      
      if (!profileId || !authToken) {
        setEditError('Profile ID or authentication token not found.');
        setEditLoading(false);
        return;
      }

      const formData = new FormData(e.target);
      
      // Get the actual userId from localStorage or use a valid default
      const actualUserId = localStorage.getItem("userId") || localStorage.getItem("id") || "1"; // Try to get actual user ID
      console.log('Available localStorage keys:', Object.keys(localStorage));
      console.log('userId from localStorage:', localStorage.getItem("userId"));
      console.log('id from localStorage:', localStorage.getItem("id"));
      console.log('Using actualUserId:', actualUserId);
      
      let updateData = {
        userId: parseInt(actualUserId), // Use actual user ID instead of default
        companyName: formData.get('companyName')?.trim() || '',
        companyDescription: formData.get('companyDescription')?.trim() || '',
        linkedinUrl: formData.get('linkedinUrl')?.trim() || '',
        websiteUrl: formData.get('websiteUrl')?.trim() || '',
        industry: formData.get('industry')?.trim() || '',
        companySize: 0, // Default to 0 as per API spec
        foundingYear: 3000, // Default to 3000 as per API spec
        status: 0 // Default value as per API spec
      };

      // Handle company size properly
      const companySizeInput = formData.get('companySize');
      if (companySizeInput && companySizeInput.trim() !== '') {
        const sizeValue = parseInt(companySizeInput);
        if (!isNaN(sizeValue) && sizeValue >= 0 && sizeValue <= 20000) {
          updateData.companySize = sizeValue;
        } else {
          setEditError('Company size must be between 0 and 20,000 employees.');
          setEditLoading(false);
          return;
        }
      }

      // Handle founding year properly
      const foundingYearInput = formData.get('foundingYear');
      if (foundingYearInput && foundingYearInput.trim() !== '') {
        const yearValue = parseInt(foundingYearInput);
        if (!isNaN(yearValue) && yearValue >= 1800 && yearValue <= 3000) {
          updateData.foundingYear = yearValue;
        } else {
          setEditError('Founding year must be between 1800 and 3000.');
          setEditLoading(false);
          return;
        }
      }

      console.log('Company size input:', companySizeInput);
      console.log('Parsed company size:', updateData.companySize);
      console.log('Final update data:', updateData);

      // Validate required fields
      if (!updateData.companyName || !updateData.companyDescription) {
        setEditError('Company name and description are required.');
        setEditLoading(false);
        return;
      }

      // Validate company size
      if (updateData.companySize < 0 || updateData.companySize > 20000) {
        setEditError('Company size must be between 0 and 20,000 employees.');
        setEditLoading(false);
        return;
      }

      // Validate founding year
      if (updateData.foundingYear < 1800 || updateData.foundingYear > 3000) {
        setEditError('Founding year must be between 1800 and 3000.');
        setEditLoading(false);
        return;
      }

      console.log('Sending update data:', updateData);
      console.log('Profile ID:', profileId);
      console.log('Auth Token:', authToken ? 'Present' : 'Missing');
      console.log('Request URL:', `http://fit4job.runasp.net/api/CompanyProfiles/${profileId}`);
      console.log('Request headers:', {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      });

      const response = await axios.put(`http://fit4job.runasp.net/api/CompanyProfiles/${profileId}`, updateData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Update response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Success flag:', response.data?.success);
      console.log('Response message:', response.data?.message);

      if (response.data && response.data.success === true) {
        setEditSuccess('Profile updated successfully!');
        // Reload profile data
        await loadSavedImages();
        setTimeout(() => {
          closeEditModal();
        }, 2000);
      } else {
        // Handle API error response
        let errorMessage = 'Failed to update profile. Please try again.';
        if (response.data?.message) {
          console.error('Full error message:', response.data.message);
          errorMessage = response.data.message;
        }
        setEditError(errorMessage);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error.response?.status === 400) {
        console.error('400 Bad Request - Full error details:', error.response);
        console.error('Error data structure:', error.response.data);
        console.error('Errors object:', error.response.data?.errors);
        
        if (error.response.data?.errors) {
          console.error('Error keys:', Object.keys(error.response.data.errors));
          console.error('Error values:', Object.values(error.response.data.errors));
          const errorDetails = Object.values(error.response.data.errors).flat();
          console.error('Flattened error details:', errorDetails);
          errorMessage = `Validation error: ${errorDetails.join(', ')}`;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data) {
          errorMessage = `Server error: ${JSON.stringify(error.response.data)}`;
        } else {
          errorMessage = 'Invalid data. Please check your inputs.';
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Profile not found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setEditError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="bg-gray-50 md:p-10">
        {/* Loading State */}
        {loading && (
          <div className="max-w-[1300px] mx-auto mb-6">
            <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="font-medium">Loading profile data...</span>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {uploadSuccess && (
          <div className="max-w-[1300px] mx-auto mb-6">
            <div className="bg-green-50 text-green-800 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{uploadSuccess}</span>
            </div>
          </div>
        )}

        {uploadError && (
          <div className="max-w-[1300px] mx-auto mb-6">
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{uploadError}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-xl shadow sm:p-6 lg:p-10 max-w-[1300px] mx-auto">
          {/* Cover Image with Upload */}
          <div className="mb-4 relative">
            {coverImageTimeout ? (
              <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            ) : coverImageLoading || !coverImage ? (
              <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <img
                src={coverImage}
                alt="Company Profile"
                className="w-full h-auto object-cover rounded-lg"
              />
            )}
            <button
              onClick={triggerCoverUpload}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all duration-200"
            >
              <CameraIcon className="w-5 h-5 text-gray-600" />
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
            <div className="flex items-center gap-4">
              {/* Profile Image with Upload */}
              <div className="relative">
                {profileImageTimeout ? (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full border-4 border-white shadow-md">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                ) : profileImageLoading || !profileImage ? (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full border-4 border-white shadow-md">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <img
                    src={profileImage}
                    alt="Company Logo"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  />
                )}
                <button
                  onClick={triggerProfileUpload}
                  className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full shadow-md transition-all duration-200"
                >
                  <CameraIcon className="w-3 h-3 text-white" />
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
              </div>
              
              <div>
                <h1 className="font-bold text-xl sm:text-2xl">{profileData.companyName}</h1>
              </div>
            </div>
            <button 
              onClick={openEditModal}
              className="flex items-center text-xs font-medium cursor-pointer hover:underline"
            >
              <img src={edit} className="w-4 h-4 mr-1" alt="Edit" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Description + Info */}
        <div className="flex flex-col md:flex-row gap-6 my-8 max-w-[1300px] mx-auto">
          {/* About */}
          <div className="p-5 rounded-xl bg-white shadow flex-grow md:flex-[2]">
            <h3 className="font-semibold text-base mb-4">About</h3>
            <p className="text-sm text-gray-700 mb-6">
              {profileData.companyDescription}
            </p>
            <h6 className="font-semibold text-sm mb-2">Industries</h6>
            <div className="flex flex-wrap gap-2">
              <span className="text-blue-900 bg-blue-100 px-3 py-1 text-xs rounded-2xl">
                {profileData.industry}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 rounded-xl bg-white shadow flex-grow md:flex-[1]">
            <h3 className="font-semibold text-base mb-4">Company Info</h3>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <GlobeAltIcon className="w-5 h-5 text-gray-400 mr-2" />
                Website
              </div>
              <p className="text-xs break-words text-gray-700">
                {profileData.websiteUrl}
              </p>
            </div>

            {profileData.linkedinUrl && (
              <div className="mb-3">
                <div className="flex items-center text-sm mb-1">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </div>
                <p className="text-xs break-words text-gray-700">
                  {profileData.linkedinUrl}
                </p>
              </div>
            )}

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                Email
              </div>
              <p className="text-xs break-words text-gray-700">
                {profileData.email}
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <UsersIcon className="w-5 h-5 text-gray-400 mr-2" />
                Company Size
              </div>
              <p className="text-xs text-gray-700">{profileData.companySize}</p>
            </div>

            <div className="mb-1">
              <div className="flex items-center text-sm mb-1">
                <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-2" />
                Founded
              </div>
              <p className="text-xs text-gray-700">{profileData.foundingYear}</p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white rounded-xl shadow max-w-[1300px] mx-auto p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-base sm:text-lg">
              Active Job Listings
            </h2>
            <button className="text-blue-600 text-sm hover:underline whitespace-nowrap">
              + Add New Job
            </button>
          </div>
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 text-left">Job Title</th>
                <th className="py-2 pr-4 text-left">Location</th>
                <th className="py-2 pr-4 text-left">Type</th>
                <th className="py-2 pr-4 text-left">Applications</th>
                <th className="py-2 pr-4 text-left">Posted</th>
                <th className="py-2 pr-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title: 'Senior Frontend Developer',
                  location: 'San Francisco, CA',
                  type: 'Full-time',
                  apps: 42,
                  posted: '5 days ago',
                },
                {
                  title: 'DevOps Engineer',
                  location: 'Remote',
                  type: 'Full-time',
                  apps: 28,
                  posted: '1 week ago',
                },
                {
                  title: 'UI/UX Designer',
                  location: 'San Francisco, CA',
                  type: 'Full-time',
                  apps: 36,
                  posted: '3 days ago',
                },
                {
                  title: 'Backend Developer',
                  location: 'New York, NY',
                  type: 'Full-time',
                  apps: 24,
                  posted: '2 days ago',
                },
              ].map((job, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 font-semibold">{job.title}</td>
                  <td className="py-3 text-gray-500">{job.location}</td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3">{job.apps}</td>
                  <td className="py-3">{job.posted}</td>
                  <td className="py-3 space-x-4 text-sm">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Edit Company Profile</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mx-6 mt-4 p-4 rounded-lg border bg-blue-50 text-blue-800 border-blue-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {editSuccess && (
              <div className="mx-6 mt-4 p-4 rounded-lg border bg-green-50 text-green-800 border-green-200 flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{editSuccess}</span>
              </div>
            )}

            {editError && (
              <div className="mx-6 mt-4 p-4 rounded-lg border bg-red-50 text-red-800 border-red-200 flex items-center space-x-3">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{editError}</span>
              </div>
            )}
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="companyName"
                    defaultValue={profileData.companyName}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <input
                    name="industry"
                    defaultValue={profileData.industry}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    name="websiteUrl"
                    type="url"
                    defaultValue={profileData.websiteUrl}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                  <input
                    name="linkedinUrl"
                    type="url"
                    defaultValue={profileData.linkedinUrl}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size (Number of Employees)</label>
                  <input
                    name="companySize"
                    type="number"
                    placeholder="Enter number of employees (0 if not specified)"
                    defaultValue={profileData.companySize === 'Company size not specified' ? '' : profileData.companySize.replace(' employees', '')}
                    min="0"
                    max="20000"
                    step="1"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the total number of employees (0 to 20,000, 0 if not specified)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Founding Year</label>
                  <input
                    name="foundingYear"
                    type="number"
                    placeholder="Enter founding year"
                    defaultValue={profileData.foundingYear === 'Year not specified' ? '' : profileData.foundingYear}
                    min="1800"
                    max="3000"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter the founding year (1800 to 3000)</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="companyDescription"
                    defaultValue={profileData.companyDescription}
                    required
                    rows="4"
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Crop {cropType === 'cover' ? 'Cover' : 'Profile'} Image
              </h3>
              <button
                onClick={closeCropModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {cropType === 'cover' 
                  ? 'Recommended size: 1200x400 pixels (3:1 ratio)' 
                  : 'Recommended size: 400x400 pixels (1:1 ratio)'
                }
              </p>
              <div className="max-h-96 overflow-auto">
                <ReactCrop
                  crop={crop}
                  onChange={handleCropComplete}
                  aspect={cropType === 'cover' ? 3 : 1}
                  minWidth={100}
                  minHeight={cropType === 'cover' ? 33 : 100}
                >
                  <img src={imageToCrop} alt="Crop preview" />
                </ReactCrop>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeCropModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Crop & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
