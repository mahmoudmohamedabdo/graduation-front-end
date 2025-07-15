import React from 'react';
import profile from '../../assets/Images/CmpanyProfile.png';
import location from '../../assets/Images/location.png';
import edit from '../../assets/Images/Edit.png'
import {
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  UsersIcon,
  BriefcaseIcon,
  
} from '@heroicons/react/24/outline';
import { SidebarLayout } from '../../layouts/SidebarLayout';

export default function CompanyProfile() {
  return (
    <SidebarLayout>
      <div className="bg-gray-50 md:p-10">
        {/* Header */}
        <div className="bg-white rounded-xl shadow sm:p-6 lg:p-10 max-w-[1300px] mx-auto">
          <div className="mb-4">
            <img
              src={profile}
              alt="Company Profile"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0">
            <div>
              <h1 className="font-bold text-xl sm:text-2xl">TechCorp Inc.</h1>
              <span className="flex items-center text-xs mt-1 text-gray-600">
                <img src={location} className="w-4 h-4 mr-1" alt="Location" />
                San Francisco, CA
              </span>
            </div>
            <div className="flex items-center text-xs font-medium cursor-pointer hover:underline">
              <img src={edit} className="w-4 h-4 mr-1" alt="Edit" />
              Edit Profile
            </div>
          </div>
        </div>

        {/* Description + Info */}
        <div className="flex flex-col md:flex-row gap-6 my-8 max-w-[1300px] mx-auto">
          {/* About */}
          <div className="p-5 rounded-xl bg-white shadow flex-grow md:flex-[2]">
            <h3 className="font-semibold text-base mb-4">About</h3>
            <p className="text-sm text-gray-700 mb-6">
              TechCorp is a leading software development company specializing in
              cloud solutions, AI, and enterprise applications.
            </p>
            <h6 className="font-semibold text-sm mb-2">Industries</h6>
            <div className="flex flex-wrap gap-2">
              <span className="text-blue-900 bg-blue-100 px-3 py-1 text-xs rounded-2xl">
                Software Development
              </span>
              <span className="text-blue-900 bg-blue-100 px-3 py-1 text-xs rounded-2xl">
                Cloud Computing
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-5 rounded-xl bg-white shadow flex-grow md:flex-[1]">
            <h3 className="font-semibold text-base mb-4">Company Info</h3>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <GlobeAltIcon className="w-5 h-5 text-gray-400 mr-2" />
                Website
              </div>
              <p className="text-xs break-words text-gray-700">
                https://techcorp.example.com
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
                Email
              </div>
              <p className="text-xs break-words text-gray-700">
                careers@techcorp.example.com
              </p>
            </div>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <PhoneIcon className="w-5 h-5 text-gray-400 mr-2" />
                Phone
              </div>
              <p className="text-xs text-gray-700">+1(555)123</p>
            </div>

            <div className="mb-3">
              <div className="flex items-center text-sm mb-1">
                <UsersIcon className="w-5 h-5 text-gray-400 mr-2" />
                Company Size
              </div>
              <p className="text-xs text-gray-700">50-100 employees</p>
            </div>

            <div className="mb-1">
              <div className="flex items-center text-sm mb-1">
                <BriefcaseIcon className="w-5 h-5 text-gray-400 mr-2" />
                Founded
              </div>
              <p className="text-xs text-gray-700">2015</p>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="bg-white rounded-xl shadow max-w-[1300px] mx-auto p-6 overflow-x-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="font-semibold text-base sm:text-lg">
              Active Job Listings
            </h2>
            <button className="text-blue-600 text-sm hover:underline whitespace-nowrap">
              + Add New Job
            </button>
          </div>
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 pr-4 text-left">Job Title</th>
                <th className="py-2 pr-4 text-left">Location</th>
                <th className="py-2 pr-4 text-left">Type</th>
                <th className="py-2 pr-4 text-left">Applications</th>
                <th className="py-2 pr-4 text-left">Posted</th>
                <th className="py-2 pr-4 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  title: 'Senior Frontend Developer',
                  location: 'San Francisco, CA',
                  type: 'Full-time',
                  apps: 42,
                  posted: '5 days ago',
                },
                {
                  title: 'DevOps Engineer',
                  location: 'Remote',
                  type: 'Full-time',
                  apps: 28,
                  posted: '1 week ago',
                },
                {
                  title: 'UI/UX Designer',
                  location: 'San Francisco, CA',
                  type: 'Full-time',
                  apps: 36,
                  posted: '3 days ago',
                },
                {
                  title: 'Backend Developer',
                  location: 'New York, NY',
                  type: 'Full-time',
                  apps: 24,
                  posted: '2 days ago',
                },
              ].map((job, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-3 font-semibold">{job.title}</td>
                  <td className="py-3 text-gray-500">{job.location}</td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                      {job.type}
                    </span>
                  </td>
                  <td className="py-3">{job.apps}</td>
                  <td className="py-3">{job.posted}</td>
                  <td className="py-3 space-x-4 text-sm">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SidebarLayout>
  );
}
