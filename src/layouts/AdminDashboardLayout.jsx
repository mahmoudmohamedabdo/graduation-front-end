import React, { useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  LayoutGrid,
  FileText,
  Briefcase,
  Users,
  Building2,
  LogOut,
} from 'lucide-react'

export const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/landingpage');
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/admin-dashboard' },
    { icon: FileText, label: 'Track Manager', path: '/admin-dashboard/tracks' },
    { icon: Building2, label: 'Companies', path: '/admin-dashboard/companies' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-600">Fit 4 Job</h1>
        </div>
        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin&background=random"
              alt="Admin avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  )
} 