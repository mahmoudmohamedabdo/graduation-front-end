import React, { useState } from "react";
import AuthSwitcher from "../Components/AuthSwitcher";

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);

  const openAuth = () => setShowAuth(true);
  const closeAuth = () => setShowAuth(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-xl font-semibold text-gray-900">Logo</div>

        {/* Buttons */}
        <div className="space-x-4 flex items-center">
        
          <button
          onClick={openAuth}
          className="btn bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuth && (
        <div
          onClick={closeAuth}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative z-50">
            <AuthSwitcher onClose={closeAuth} />
          </div>
        </div>
      )}
    </>
  );
}
