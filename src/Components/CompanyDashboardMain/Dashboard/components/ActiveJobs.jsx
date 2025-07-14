import React from "react";
import { MoreVertical } from "lucide-react";

export function ActiveJobs() {
  const jobs = [
    {
      title: "Senior React Developer",
      postedDate: "2024-01-15",
      applicants: 12,
    },
    {
      title: "UI/UX Designer",
      postedDate: "2024-01-14",
      applicants: 8,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-5 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Active Jobs</h3>
        <button className="text-blue-600 text-sm font-medium hover:underline">Add New</button>
      </div>

      <div className="space-y-4">
        {jobs.map((job, idx) => (
          <div
            key={idx}
            className="border rounded-lg px-4 py-3 flex justify-between items-center hover:shadow-sm"
          >
            <div>
              <h4 className="font-medium text-gray-800">{job.title}</h4>
              <p className="text-sm text-gray-500">
                {job.applicants} applications • Posted {job.postedDate}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Active</span>
              <MoreVertical className="w-4 h-4 text-gray-500 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
