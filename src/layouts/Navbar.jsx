import React, { useEffect, useState } from 'react';
import user from '../assets/Images/user.png';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const [username, setUsername] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getLinkClass = (isActive) =>
    isActive
      ? "block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
      : "block text-gray-700 px-4 py-2 text-sm font-medium hover:text-blue-600 transition";

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest'); 
    }
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
            <NavLink to="/track" className={({ isActive }) => getLinkClass(isActive)}>My Learning</NavLink>
          </div>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-gray-700 font-medium text-sm">{username}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={user} alt="user" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Mobile menu button */}
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 border-t border-gray-200 pt-4 space-y-1">
            <div className="flex items-center space-x-3 px-4 pb-2">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={user} alt="user" className="w-full h-full object-cover" />
              </div>
              <span className="text-gray-700 font-medium text-sm">{username}</span>
            </div>

            <NavLink to="/home" className={({ isActive }) => getLinkClass(isActive)}>Home</NavLink>
            <NavLink to="/level" className={({ isActive }) => getLinkClass(isActive)}>Prepare</NavLink>
            <NavLink to="/jops" className={({ isActive }) => getLinkClass(isActive)}>Jobs</NavLink>
            <NavLink to="/track" className={({ isActive }) => getLinkClass(isActive)}>My Learning</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}
