// import React, { useEffect, useState } from 'react';
// import alert from '../../assets/Images/alert.png';
// import alerBlue from '../../assets/Images/alertBlue.png';
// import right from '../../assets/Images/right.png';
// import JopNav from '../../layouts/JopNav';
// import { useParams } from 'react-router-dom';

// export default function JopDetails() {
//     const { id } = useParams();
//     const [job, setJob] = useState(null);

//     useEffect(() => {
//         fetch(`http://fit4job.runasp.net/api/Jobs/${id}`)
//             .then(res => res.json())
//             .then(data => {
//                 setJob(data.data);
//             })
//             .catch(err => console.error('Error fetching job:', err));
//     }, [id]);

//     const educationLevels = {
//         1: "High School",
//         2: "Bachelor's Degree",
//         3: "Master's Degree",
//         4: "PhD"
//     };

//     const jobTypes = {
//         1: "Full-Time",
//         2: "Part-Time",
//         3: "Freelance",
//         4: "Internship"
//     };

//     const workLocationTypes = {
//         1: "On-site",
//         2: "Remote",
//         3: "Hybrid"
//     };

//     if (!job) {
//         return <div className="p-10 text-center text-gray-600">Loading...</div>;
//     }

//     return (
//         <div className="container px-4 mx-auto w-sm-full">
//             {/* Header */}
//             <div className="p-6 bg-gray-50 shadow-md">
//                 <div className="bg-white p-4 shadow-sm">
//                     <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
//                 </div>
// <JopNav id={id} />
//             </div>

//             {/* Job Details */}
//             <div className="bg-white p-6 rounded shadow-sm m-5">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>
//                 <div className="space-y-3 text-sm">
//                     <div className="flex flex-wrap">
//                         <span className="w-48 text-[#4D6182] font-medium">Experience Needed:</span>
//                         <span className="text-black">{job.yearsOfExperience}</span>
//                     </div>
//                     <div className="flex flex-wrap items-center">
//                         <span className="w-48 text-[#4D6182] font-medium">Career Level:</span>
//                         <span className="flex items-center gap-1 text-black">
//                             <img src={alerBlue} alt="" className="w-4 h-4" />
//                             Experienced (Non-Manager)
//                         </span>
//                     </div>
//                     <div className="flex flex-wrap items-center">
//                         <span className="w-48 text-[#4D6182] font-medium">Education Level:</span>
//                         <span className="flex items-center gap-1 text-black">
//                             <img src={right} alt="" className="w-4 h-4" />
//                             {educationLevels[job.educationLevel] || 'N/A'}
//                         </span>
//                     </div>
//                     <div className="flex flex-wrap">
//                         <span className="w-48 text-[#4D6182] font-medium">Salary:</span>
//                         <span className="text-black">{job.salaryRange || 'Confidential'}</span>
//                     </div>
//                     <div className="flex flex-wrap items-center">
//                         <span className="w-48 text-[#4D6182] font-medium">Job Type:</span>
//                         <span className="flex items-center gap-1 text-black">
//                             <img src={right} alt="" className="w-4 h-4" />
//                             {jobTypes[job.jobType] || 'N/A'}
//                         </span>
//                     </div>
//                     <div className="flex flex-wrap items-center">
//                         <span className="w-48 text-[#4D6182] font-medium">Work Location:</span>
//                         <span className="flex items-center gap-1 text-black">
//                             <img src={right} alt="" className="w-4 h-4" />
//                             {workLocationTypes[job.workLocationType] || 'N/A'}
//                         </span>
//                     </div>
//                 </div>

//                 {/* Skills and Tools - Placeholder */}
//                 <div className="skills bg-gray-50 rounded-2xl mt-10 p-4 w-full">
//                     <h1 className="text-[#4D6182] font-semibold mb-2">Skills And Tools:</h1>
//                     <div className="flex flex-wrap gap-3">
//                         {['Angular', 'Bootstrap', 'APIs', 'CSS', 'Design', 'Information Technology (IT)', 'JSON', 'JavaScript'].map((skill, index) => (
//                             <span key={index} className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
//                                 <img src={alert} alt="" className="w-4 h-4" />
//                                 {skill}
//                             </span>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Job Description */}
//             <div className="bg-white p-6 rounded shadow-sm m-5">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
//                 <h3 className="text-md font-semibold text-gray-800 mb-2">Job Summary</h3>
//                 <p className="text-gray-700 mb-6 whitespace-pre-line">{job.summary}</p>
//             </div>

//             {/* Job Requirements */}
//             <div className="bg-white p-6 rounded shadow-sm m-5">
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Requirements</h2>
//                 <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
//             </div>

//             {/* Apply Now Button */}
//             <div className="flex justify-end mb-10">
//                 <button className="bg-[#16A34A] text-white font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
//                     Apply Now
//                 </button>
//             </div>
//         </div>
//     );
// }





import React, { useEffect, useState } from 'react';
import alert from '../../assets/Images/alert.png';
import alerBlue from '../../assets/Images/alertBlue.png';
import right from '../../assets/Images/right.png';
import JopNav from '../../layouts/JopNav';
import { useLocation } from 'react-router-dom';

export default function JopDetails() {
    const location = useLocation();
    const { jobId } = location.state || {};
    const [job, setJob] = useState(null);

    useEffect(() => {
        if (!jobId) return;

        fetch(`http://fit4job.runasp.net/api/Jobs/${jobId}`)
            .then(res => res.json())
            .then(data => {
                setJob(data.data);
            })
            .catch(err => console.error('Error fetching job:', err));
    }, [jobId]);

    const educationLevels = {
        1: "High School",
        2: "Bachelor's Degree",
        3: "Master's Degree",
        4: "PhD"
    };

    const jobTypes = {
        1: "Full-Time",
        2: "Part-Time",
        3: "Freelance",
        4: "Internship"
    };

    const workLocationTypes = {
        1: "On-site",
        2: "Remote",
        3: "Hybrid"
    };

    if (!job) {
        return <div className="p-10 text-center text-gray-600">Loading...</div>;
    }

    return (
        <div className="container px-4 mx-auto w-sm-full">
            {/* Header */}
            <div className="p-6 bg-gray-50 shadow-md">
                <div className="bg-white p-4 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                </div>
                <JopNav id={jobId} />
            </div>

            {/* Job Details */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap">
                        <span className="w-48 text-[#4D6182] font-medium">Experience Needed:</span>
                        <span className="text-black">{job.yearsOfExperience}</span>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <span className="w-48 text-[#4D6182] font-medium">Career Level:</span>
                        <span className="flex items-center gap-1 text-black">
                            <img src={alerBlue} alt="" className="w-4 h-4" />
                            Experienced (Non-Manager)
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <span className="w-48 text-[#4D6182] font-medium">Education Level:</span>
                        <span className="flex items-center gap-1 text-black">
                            <img src={right} alt="" className="w-4 h-4" />
                            {educationLevels[job.educationLevel] || 'N/A'}
                        </span>
                    </div>
                    <div className="flex flex-wrap">
                        <span className="w-48 text-[#4D6182] font-medium">Salary:</span>
                        <span className="text-black">{job.salaryRange || 'Confidential'}</span>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <span className="w-48 text-[#4D6182] font-medium">Job Type:</span>
                        <span className="flex items-center gap-1 text-black">
                            <img src={right} alt="" className="w-4 h-4" />
                            {jobTypes[job.jobType] || 'N/A'}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center">
                        <span className="w-48 text-[#4D6182] font-medium">Work Location:</span>
                        <span className="flex items-center gap-1 text-black">
                            <img src={right} alt="" className="w-4 h-4" />
                            {workLocationTypes[job.workLocationType] || 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Skills and Tools - Placeholder */}
                <div className="skills bg-gray-50 rounded-2xl mt-10 p-4 w-full">
                    <h1 className="text-[#4D6182] font-semibold mb-2">Skills And Tools:</h1>
                    <div className="flex flex-wrap gap-3">
                        {['Angular', 'Bootstrap', 'APIs', 'CSS', 'Design', 'Information Technology (IT)', 'JSON', 'JavaScript'].map((skill, index) => (
                            <span key={index} className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                                <img src={alert} alt="" className="w-4 h-4" />
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Job Description */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Job Summary</h3>
                <p className="text-gray-700 mb-6 whitespace-pre-line">{job.summary}</p>
            </div>

            {/* Job Requirements */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Requirements</h2>
                <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
            </div>

            {/* Apply Now Button */}
            <div className="flex justify-end mb-10">
                <button className="bg-[#16A34A] text-white font-medium py-3 px-8 rounded-full shadow-lg transition duration-300">
                    Apply Now
                </button>
            </div>
        </div>
    );
}
