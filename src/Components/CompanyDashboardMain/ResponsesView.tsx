import React from 'react';
import { Search, Bell, Download } from 'lucide-react';

export const ResponsesView = ({ dataId }) => {
  const responses = [
    {
      id: '1',
      candidate: 'Ahmed Mohamed',
      email: 'ahmed.mohamed@email.com',
      position: 'Senior React Developer',
      status: 'Submitted',
      date: '2024-01-16',
      time: '14:30',
      location: 'Cairo, Egypt',
      experience: '5 years',
    },
    // ... other responses
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="my-10 mx-5" data-id={dataId}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">View Responses</h1>
        <p className="text-gray-600 mt-1">
          Manage and review all candidate responses and submissions.
        </p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                className="w-full pl-10 py-1.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <select className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
              </select>
              <select className="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Download className="h-4 w-4" />
                Export
                <span className="text-sm opacity-70">6 responses</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                  Candidate
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                  Position/Test
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response.id} className="border-b border-gray-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-medium">
                          <span>{getInitials(response.candidate)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {response.candidate}
                        </div>
                        <div className="text-sm text-gray-500">
                          {response.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {response.experience} • {response.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {response.position}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(response.status)}`}
                    >
                      {response.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {response.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {response.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};