import React from "react";
import { FaStar, FaVideo, FaRegCircle } from "react-icons/fa";
import Navbar from "../layouts/Navbar";

export default function MyLearning() {
          
    const name=localStorage.getItem("username");
  return (
    <div>
       <Navbar/> 
       <div className="min-h-screen bg-[#F9FAFB] px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold">
            {name?.charAt(0).toUpperCase()}

          </span>
          Welcome back, {name}
        </h1>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['Overview', 'Job Applications', 'Learning Tracks'].map((tab, idx) => (
            <button
              key={idx}
              className={`px-5 py-2.5 rounded-full text-sm font-medium shadow-sm transition duration-200 ${
                idx === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800  hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Stats Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          <div className="bg-white p-5 rounded-xl shadow-sm  hover:shadow-md transition">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Total Applications</h4>
              <FaRegCircle className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Jobs applied this month</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm  hover:shadow-md transition">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Active Tracks</h4>
              <FaVideo className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">4</p>
            <p className="text-sm text-gray-500 mt-1">Learning tracks in progress</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm  hover:shadow-md transition">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Average Score</h4>
              <FaStar className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold text-yellow-500">81</p>
            <p className="text-sm text-gray-500 mt-1">Across all learning tracks</p>
          </div>
        </div>

        {/* Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl shadow-sm ">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Applications</h2>
            <div className="space-y-4">
              {[
                {
                  title: 'Front End Angular Developer',
                  company: 'Tech Company',
                  date: '2024-01-15',
                  status: 'Pending',
                  color: 'bg-yellow-100 text-yellow-700',
                },
                {
                  title: 'React Developer',
                  company: 'StartupCorp',
                  date: '2024-01-10',
                  status: 'Interview',
                  color: 'bg-green-100 text-green-700',
                },
                {
                  title: 'Full Stack Engineer',
                  company: 'BigTech Inc',
                  date: '2024-01-05',
                  status: 'Rejected',
                  color: 'bg-red-100 text-red-700',
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="bg-[#F9FAFB]  rounded-lg p-4 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-500">
                      {job.company} <br /> Applied: {job.date}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${job.color}`}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white p-6 rounded-xl shadow-sm ">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Learning Progress</h2>
            <div className="space-y-6">
              {[
                {
                  track: 'Frontend Development',
                  percent: 85,
                  lessons: '20/24 lessons',
                  score: 92,
                },
                {
                  track: 'Backend Development',
                  percent: 67,
                  lessons: '12/18 lessons',
                  score: 78,
                },
                {
                  track: 'UI/UX Design',
                  percent: 45,
                  lessons: '7/16 lessons',
                  score: 88,
                },
              ].map((course, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-gray-800 text-sm">
                      {course.track}
                    </span>
                    <span className="text-sm text-blue-600 font-semibold">
                      {course.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.percent}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{course.lessons}</span>
                    <span>Score: {course.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
   

  );
}