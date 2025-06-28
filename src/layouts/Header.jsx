import React from 'react';

const Header = () => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-100">
      {/* Logo */}
      <div className="text-xl font-bold">Logo</div>

      {/* Buttons */}
      <div className="space-x-4">
        <button className="btn btn-outline">Login</button>
        <button className="btn bg-blue-500 text-white">Sign Up</button>
      </div>
    </div>
  );
};

export default Header;
