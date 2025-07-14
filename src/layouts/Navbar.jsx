import React, { useEffect, useState, useRef } from 'react';
import user from '../assets/Images/user.png';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const getLinkClass = (isActive) =>
    isActive
      ? "block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      : "block w-full text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition";

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || 'Guest');

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">Logo</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/home" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink>
            <NavLink to="/level" className={({ isActive }) => getLinkClass(isActive)}>Prepare</NavLink>
            <NavLink to="/jops" className={({ isActive }) => getLinkClass(isActive)}>Jobs</NavLink>
            <NavLink to="/myLearning" className={({ isActive }) => getLinkClass(isActive)}>My Learning</NavLink>

          </div>

          {/* Profile Desktop */}
          <div className="hidden md:flex items-center space-x-3 relative" ref={profileRef}>
            <span className="text-gray-700 font-medium text-sm">{username}</span>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="w-8 h-8 rounded-full overflow-hidden focus:outline-none"
            >
              <img src={user} alt="user" className="w-full h-full object-cover" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg z-50 p-2 space-y-1">
                <NavLink to="/profile" className={getLinkClass(false)}>Profile</NavLink>
                <NavLink to="/myLearning" className={getLinkClass(false)}>My Learning</NavLink>
                <NavLink to="/help" className={getLinkClass(false)}>Help & Support</NavLink>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate('/landingpage');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-gray-100 rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 border-t border-gray-200 pt-4 px-4 space-y-2 bg-white rounded-lg shadow-md pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={user} alt="user" className="w-full h-full object-cover" />
              </div>
              <span className="text-gray-700 font-medium text-sm">{username}</span>
            </div>

            {/* Navigation Links */}
            <div className=" pt-2">
              <NavLink to="/home" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink>
              <NavLink to="/level" className={({ isActive }) => getLinkClass(isActive)}>Prepare</NavLink>
              <NavLink to="/jops" className={({ isActive }) => getLinkClass(isActive)}>Jobs</NavLink>
              <NavLink to="/myLearning" className={({ isActive }) => getLinkClass(isActive)}>My Learning</NavLink>

            </div>

            {/* Divider */}
            <hr className="border-t border-gray-200 my-2" />

            {/* Profile Links */}
            <div className="space-y-1">
              <NavLink to="/profile" className={getLinkClass(false)}>Profile</NavLink>
              <NavLink to="/help" className={getLinkClass(false)}>Help & Support</NavLink>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 font-semibold hover:bg-gray-100 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
