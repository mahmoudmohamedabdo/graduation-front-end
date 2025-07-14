import React from 'react'
import company from '../../../assets/Images/company.png'
import { useNavigate } from 'react-router-dom'
export default function CompanyCard() {
    const navigae=useNavigate()
    const showJopDetails=()=>{
   navigae('/jopDetails')
    }
    return (
        <div className='flex flex-col items-center '>
            <div className="card card-border bg-base-100 w-[45rem] flex-col m-3 p-4">
                <div className="content flex items-center justify-between gap-6">
                    {/*Text */}
                    <div className="card-body flex-1">
                        <div className='flex flex-col items-start'>
                            {/* Job Title */}
                            <h2 className="card-title text-[#1E7CE8]">Front End Angular Developer</h2>

                            {/* Company Location */}
                            <p className='text-black mt-1'>
                                TechCompany <span className='text-[#000000B2]'>- New Cairo, Cairo</span>
                            </p>

                            {/* Skills / Experience */}
                            <p className='text-[#00000099] my-3'>
                                Experienced (Non-Manager) · 3-5 Yrs of Exp · Angular · Bootstrap · APIs · CSS · Design · JSON · JavaScript · IT
                            </p>
                        </div>

                        {/* Apply Button */}
                        <div className="card-actions justify-start">
                            <button className="btn text-white bg-[#1E7CE8] rounded-2xl px-6" onClick={showJopDetails}>Apply Now</button>
                        </div>
                    </div>

                    {/* Company Image*/}
                    <div className="img w-24 h-24 flex-shrink-0">
                        <img
                            src={company}
                            alt="Company Logo"
                            className="w-full h-full object-contain rounded-md shadow"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
