import React from 'react';
import user from '../assets/Images/user.png'
export default function Navbar() {

  const toggleMobileMenu = () => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };


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
            <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
              Prepare
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
              Jobs
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">
              My Learning
            </a>
          </div>

          {/* User Profile */}
          <div className="hidden md:flex items-center space-x-3">
            <span className="text-gray-700 font-medium text-sm">Ahmed Mohamed</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold"><img src={user} alt="userImage" /></span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" className="hidden md:hidden pb-4">
          <div className="space-y-2">
            <a href="#" className="block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              Home
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">
              Prepare
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">
              Jobs
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium">
              My Learning
            </a>
            <div className="flex items-center space-x-3 px-4 py-2 border-t border-gray-200 mt-4 pt-4">
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold"><img src={user} alt="userImage" /></span>
              </div>
              <span className="text-gray-700 font-medium text-sm">Ahmed Mohamed</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

