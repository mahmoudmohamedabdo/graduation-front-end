import React from "react";
import { UserIcon, ArrowRightIcon } from "lucide-react";

export function TopPerformingJobs() {
  const jobs = [
    {
      title: "Senior Frontend Developer",
      days: "5 days ago",
      applications: 42,
      percentage: 84,
    },
    {
      title: "DevOps Engineer",
      days: "1 week ago",
      applications: 28,
      percentage: 56,
    },
    {
      title: "UI/UX Designer",
      days: "3 days ago",
      applications: 36,
      percentage: 72,
    },
  ];

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-medium mb-4">Top Performing Jobs</h2>
      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between">
              <h3 className="font-medium">{job.title}</h3>
              <span className="text-sm text-gray-500">{job.days}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {job.applications} applications
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${job.percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500">{job.percentage}%</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <a href="#" className="text-blue-600 text-sm flex items-center">
          Post a new job
          <ArrowRightIcon className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}
