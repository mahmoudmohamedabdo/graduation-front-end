import React from 'react'
import { AdminSideBar } from '../../layouts/AdminSideBar'
import card1 from '../../assets/Images/card1.png'
import card2 from '../../assets/Images/card2.png'
import card3 from '../../assets/Images/card3.png'
import card4 from '../../assets/Images/card4.png'

export default function TrackManager() {
    return (
        <AdminSideBar>
            <div className="bg-gray-50 md:p-10">
                <div className='flex items-center flex-row justify-between'>
                    <div>
                        <h1 className='text-[24px]'>Track Manager</h1>
                        <p className='text-[#4B5563] text-[16px] '>Manage career tracks, curriculum, and monitor student progress</p>
                    </div>
                    <div>
                        <button className='bg-[#2563EB] text-white rounded-lg px-2 py-1'>Create New Track</button>
                    </div>
                </div>


                {/**Cards */}
                <div className='flex py-5'>

                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Total Tracks</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#10B981] text-[14px] '>8 active tracks</p>

                        </div>
                        <div>
                            <img src={card1} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Active Students</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#10B981] text-[14px] '>+15% this month</p>

                        </div>
                        <div>
                            <img src={card2} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Avg Completion Rate</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#EA580C] text-[14px] '>+3% from last month</p>

                        </div>
                        <div>
                            <img src={card3} alt="" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl flex shadow p-4  mx-auto items-center justify-between">
                        <div className='pr-10'>
                            <p className='text-[#4B5563] text-[16px] '>Curriculum Items</p>
                            <h1 className='text-[24px]'>12</h1>
                            <p className='text-[#9333EA] text-[14px] '>38 courses, 418 lessons</p>

                        </div>
                        <div>
                            <img src={card4} alt="" />
                        </div>
                    </div>
                </div>

               

               {/* Career Tracks Section */}
<div className="bg-white rounded-xl shadow max-w-[1300px] mx-auto mt-6 p-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
    <h2 className="font-semibold text-base sm:text-lg">Career Tracks</h2>
    <div className="flex gap-2">
      <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
        <option>All Tracks</option>
        <option>Frontend</option>
        <option>Backend</option>
      </select>
      <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
        <option>Name A-Z</option>
        <option>Name Z-A</option>
        <option>Students ↑</option>
        <option>Completion ↑</option>
      </select>
    </div>
  </div>

  <table className="min-w-full text-sm text-gray-700">
    <thead>
      <tr className="border-b border-gray-200 text-gray-500 text-left">
        <th className="py-2 pr-4">DESCRIPTION</th>
        <th className="py-2 pr-4">STUDENTS</th>
        <th className="py-2 pr-4">COMPLETION RATE</th>
      </tr>
    </thead>
    <tbody>
      {[
        {
          desc: 'Complete frontend development track covering modern frameworks, responsive design, and best practices',
          students: 847,
          diff: '+23 this week',
          rate: 82,
        },
        {
          desc: 'Comprehensive backend development with databases, APIs, and cloud deployment strategies',
          students: 623,
          diff: '+18 this week',
          rate: 76,
        },
        {
          desc: 'User interface and experience design fundamentals with modern design tools and methodologies',
          students: 492,
          diff: '+31 this week',
          rate: 89,
        },
        {
          desc: 'Infrastructure automation, containerization, and cloud deployment for modern applications',
          students: 287,
          diff: '+12 this week',
          rate: 71,
        },
        {
          desc: 'Cross-platform and native mobile app development for iOS and Android platforms',
          students: 356,
          diff: '+19 this week',
          rate: 84,
        },
        {
          desc: 'Data analysis, visualization, and machine learning fundamentals for business insights',
          students: 198,
          diff: '+8 this week',
          rate: 67,
        },
      ].map((track, idx) => (
        <tr key={idx} className="border-b border-gray-100">
          <td className="py-4 pr-4">{track.desc}</td>
          <td className="py-4 pr-4">
            <div className="font-semibold">{track.students}</div>
            <div className="text-xs text-green-600">{track.diff}</div>
          </td>
          <td className="py-4 pr-4">
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${track.rate}%` }}
                />
              </div>
              <div className="text-sm font-medium text-gray-700">{track.rate}%</div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className="flex justify-between mt-6 text-sm text-gray-500 items-center">
    <span>Showing 1 to 6 of 12 tracks</span>
    <div className="flex items-center gap-2">
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Previous</button>
      <button className="px-3 py-1 rounded border bg-blue-600 text-white">1</button>
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">2</button>
      <button className="px-3 py-1 rounded border text-gray-500 hover:bg-gray-100">Next</button>
    </div>
  </div>
</div>
            </div></AdminSideBar>

    )
}
