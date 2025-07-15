import React from "react";
import { UserIcon, FileTextIcon, CheckSquareIcon } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      icon: <UserIcon className="w-5 h-5 text-gray-500" />,
      person: "John Doe",
      action: "applied to",
      target: "Senior Frontend Developer",
      time: "2 hours ago",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      icon: <FileTextIcon className="w-5 h-5 text-gray-500" />,
      person: "Sarah Smith",
      action: "completed",
      target: "React JS Assessment",
      time: "4 hours ago",
      status: "Passed",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      icon: <CheckSquareIcon className="w-5 h-5 text-gray-500" />,
      person: "Mike Johnson",
      action: "submitted",
      target: "API Integration Task",
      time: "1 day ago",
      status: "Reviewing",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      icon: <FileTextIcon className="w-5 h-5 text-gray-500" />,
      person: "Emily Wilson",
      action: "completed",
      target: "JavaScript Fundamentals",
      time: "1 day ago",
      status: "Failed",
      statusColor: "bg-red-100 text-red-800",
    },
    {
      icon: <UserIcon className="w-5 h-5 text-gray-500" />,
      person: "David Brown",
      action: "applied to",
      target: "Backend Developer",
      time: "2 days ago",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {activity.icon}
              </div>
              <div>
                <p className="text-sm">
                  <span className="font-medium">{activity.person}</span>{" "}
                  <span className="text-gray-500">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">{activity.time}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${activity.statusColor}`}
              >
                {activity.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <a
          href="#"
          className="text-blue-600 text-sm flex items-center justify-center"
        >
          View all activity
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}