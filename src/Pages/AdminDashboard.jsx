import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  LayoutGrid,
  FileText,
  Briefcase,
  Users,
  Building2,
  LogOut,
  LineChart,
} from 'lucide-react'

export const AdminDashboard = ({ dataId }) => { // حذف الـ TypeScript typings
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/landingpage');
  };
  return (
    <div className="min-h-screen bg-gray-100" data-id={dataId}>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 w-64 h-full bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-blue-600">Fit 4 Job</h1>
        </div>
        <nav className="space-y-2 flex-grow">
          <a
            href="/admin-dashboard"
            className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg"
          >
            <LayoutGrid size={20} />
            Dashboard
          </a>
          <a
            href="/trackManager"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <FileText size={20} />
            Track Manager
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Briefcase size={20} />
            Job Manager
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <FileText size={20} />
            Exam Manager
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Users size={20} />
            Registration Requests
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Building2 size={20} />
            Companies
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Building2 size={20} />
            Company Profile
          </a>
        </nav>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <img
              src="https://ui-avatars.com/api/?name=Tech+Corp&background=random"
              alt="Company logo"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">TechCorp Inc.</p>
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
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell size={20} />
            </button>
          </div>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-4">Total Companies</h3>
            <div className="space-y-2">
              <div className="text-3xl font-bold">156</div>
              <div className="text-green-500 text-sm">+12% from last month</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-4">Total Tracks</h3>
            <div className="space-y-2">
              <div className="text-3xl font-bold">12</div>
              <div className="text-green-500 text-sm">+8% from last month</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-4">Total Exams</h3>
            <div className="space-y-2">
              <div className="text-3xl font-bold">89</div>
              <div className="text-green-500 text-sm">+16% from last month</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 mb-4">Pending Requests</h3>
            <div className="space-y-2">
              <div className="text-3xl font-bold">12</div>
              <div className="text-red-500 text-sm">Requires attention</div>
            </div>
          </div>
        </div>
        {/* Activity and Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="font-medium">New company registered</p>
                  <p className="text-sm text-gray-500">
                    Senior React Developer at StartupXYZ
                  </p>
                  <p className="text-sm text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="font-medium">New job posted</p>
                  <p className="text-sm text-gray-500">
                    TechCorp Inc. joined the platform
                  </p>
                  <p className="text-sm text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                <div>
                  <p className="font-medium">Exam completed</p>
                  <p className="text-sm text-gray-500">
                    React Fundamentals Assessment
                  </p>
                  <p className="text-sm text-gray-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <LineChart className="text-gray-700" size={24} />
              <h3 className="text-lg font-semibold">Platform Growth</h3>
            </div>
            <img
              src="https://cdn.pixabay.com/photo/2016/06/13/08/53/graph-1453843_1280.png"
              alt="Platform growth chart"
              className="w-full h-48 object-contain rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
