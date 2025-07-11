import React from 'react'
import CompanyCard from './JopsComponent/CompanyCard'
import Navbar from '../../layouts/Navbar'


export default function Jops() {
  return (
    <div className='bg-[#F8F8F8]'>
    <Navbar/>
<div className="haeder text-2xl m-8 px-3 py-5 font-semibold bg-white">
    Get Your Dream Job
</div>
{/**Filters */}

<div className="w-full flex flex-wrap gap-4 justify-center p-4 ">
      {/* Role */}
      <select className="border border-none   rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Role</option>
       
      </select>
      {/* Experience */}
      <select className="border border-none  rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Experience</option>
    
      </select>
      {/* Location */}
      <select className="border border-none  rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Location</option>
      </select>

      {/* Company */}
      <select className="border border-none  rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option>Company</option>
      </select>
    </div>

 {/**Company Card */}
 
<CompanyCard/>
<CompanyCard/>
<CompanyCard/>
<CompanyCard/>

    </div>
  )
}
