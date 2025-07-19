import React from 'react'
import {
  Bell,
  LineChart,
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export const AdminDashboardHome = () => {
  // Growth chart data
  const growthData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Registered Companies',
        data: [45, 52, 68, 75, 89, 156],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Active Users',
        data: [120, 145, 180, 220, 280, 320],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  }

  // Statistics chart data
  const statsData = {
    labels: ['Companies', 'Tracks', 'Exams', 'Requests'],
    datasets: [
      {
        label: 'Count',
        data: [156, 12, 89, 12],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="p-8">
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
            <div className="h-48">
              <Line data={growthData} options={chartOptions} />
            </div>
          </div>
        </div>
        
        {/* Platform Statistics */}
        <div className="mt-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Platform Statistics</h3>
            <div className="h-64">
              <Bar data={statsData} options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    ...chartOptions.plugins.legend,
                    labels: {
                      font: { size: 16 },
                      color: '#2563EB',
                    },
                  },
                  tooltip: {
                    enabled: true,
                    callbacks: {
                      label: function(context) {
                        return `Count: ${context.parsed.y}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 15 },
                      color: '#374151',
                    },
                  },
                  y: {
                    beginAtZero: true,
                    ticks: {
                      font: { size: 15 },
                      color: '#374151',
                      stepSize: 20,
                    },
                  },
                },
              }} />
            </div>
            <div className="text-center text-gray-500 text-sm mt-2">
              This chart displays the number of companies, tracks, exams, and registration requests on the platform.
            </div>
          </div>
        </div>
    </div>
  )
} 