import React, { useState } from "react";
import {
  LayoutDashboard,
  Building,
  Briefcase,
  FileText,
  CheckSquare,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinks = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/companydashboard" },
    { icon: Building, label: "Company Profile", to: "/company-profile" },
    { icon: Briefcase, label: "Add Job", to: "/job-quiz/0" },
    { icon: FileText, label: "Add Exam", to: "/" },
    { icon: CheckSquare, label: "Add Task", to: "/task" },
    { icon: Users, label: "View Responses", to: "/responses" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white bg-opacity-80 border-b border-gray-200 py-4 px-6 flex w-full justify-between items-center lg:pl-72 fixed backdrop-blur-sm z-30">
        <h1 className="text-xl font-medium">Dashboard</h1>

        <div className="flex items-center gap-4">
          <button className="px-2 rounded-full hover:bg-gray-100 relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-white"></span>
          </button>

          <div className="lg:hidden">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* Sidebar - Large Screen */}
        <aside className="hidden lg:flex w-60 bg-white border-r border-gray-200 flex-col fixed top-0 left-0 h-full z-40 ">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-blue-600 font-bold text-xl">TechHire</h1>
          </div>
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navLinks.map((item, idx) => (
                <li key={idx}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                        isActive
                          ? "text-[#2563EB] bg-[#2563EB1A] font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                />
              </div>
              <div>
                <p className="text-sm font-medium">TechCorp Inc.</p>
                <div className="flex items-center text-xs text-gray-500">
                  <LogOut className="w-3 h-3 mr-1" />
                  <span>Logout</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <aside className="w-60 bg-white border-r border-gray-200 flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-blue-600 font-bold text-xl">TechHire</h1>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-2">
                <ul className="space-y-1">
                  {navLinks.map((item, idx) => (
                    <li key={idx}>
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                            isActive
                              ? "text-[#2563EB] bg-[#2563EB1A] font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`
                        }
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="User"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">TechCorp Inc.</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <LogOut className="w-3 h-3 mr-1" />
                      <span>Logout</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
            <div
              className="flex-1 bg-black/50"
              onClick={() => setIsSidebarOpen(false)}
            />
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-60 bg-gray-50 overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
}
