import React, { useState, useEffect } from 'react';
import CompanyCard from './JopsComponent/CompanyCard';
import Navbar from '../../layouts/Navbar';
import axios from 'axios';

export default function Jops() {
  const [jops, setJops] = useState([]);

  useEffect(() => {
    axios
      .get('http://fit4job.runasp.net/api/Jobs')
      .then((response) => {
        console.log(response.data.data); // Log the data array
        if (response.data && Array.isArray(response.data.data)) {
          setJops(response.data.data);
        } else {
          console.warn('No valid job data returned:', response.data);
          setJops([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  return (
    <div className="bg-[#F8F8F8]">
      <Navbar />
      <div className="header text-2xl m-8 px-3 py-5 font-semibold bg-white">
        Get Your Dream Job
      </div>

      {/* Filters */}
      <div className="w-full flex flex-wrap gap-4 justify-center p-4">
        {/* Role */}
        <select className="border border-none rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Role</option>
        </select>
        {/* Experience */}
        <select className="border border-none rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Experience</option>
        </select>
        {/* Location */}
        <select className="border border-none rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Location</option>
        </select>
        {/* Company */}
        <select className="border border-none rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Company</option>
        </select>
      </div>

      {/* Company Cards */}
      {jops.length > 0 ? (
        jops.map((job) => <CompanyCard key={job.id} job={job} />)
      ) : (
        <p className="text-center text-gray-500">No jobs available.</p>
      )}
    </div>
  );
}