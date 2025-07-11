import React from 'react';
import alert from '../../assets/Images/alert.png';
import alerBlue from '../../assets/Images/alertBlue.png';
import right from '../../assets/Images/right.png';
import JopNav from '../../layouts/JopNav';

export default function JopDetails() {
    return (
        <div className="container px-4 mx-auto w-sm-full">
            {/* Header */}
            <div className="p-6 bg-gray-50 shadow-md">
                <div className="bg-white p-4 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800">Frontend Development</h2>
                </div>

                <JopNav/>
            </div>

            {/* Job Details */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Details</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex flex-wrap">
                        <span className="w-48 text-[#4D6182] font-medium">Experience Needed:</span>
                        <span className="text-black">3 to 5 years</span>
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
                            <img src={right} alt="" className="w-4 h-4" /> Bachelor's Degree
                        </span>
                    </div>

                    <div className="flex flex-wrap">
                        <span className="w-48 text-[#4D6182] font-medium">Salary:</span>
                        <span className="text-black">Confidential</span>
                    </div>

                    <div className="flex flex-wrap items-center">
                        <span className="w-48 text-[#4D6182] font-medium">Job Categories:</span>
                        <span className="flex items-center gap-1 text-black">
                            <img src={right} alt="" className="w-4 h-4" />
                            IT/Software Development
                        </span>
                    </div>
                </div>

                {/* Skills and Tools */}
                <div className="skills bg-gray-50 rounded-2xl mt-10 p-4 w-full">
                    <h1 className="text-[#4D6182] font-semibold mb-2">Skills And Tools:</h1>
                    <div className="flex flex-wrap gap-3">
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            Angular
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            Bootstrap
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            APIs
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            CSS
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            Design
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            Information Technology (IT)
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            JSON
                        </span>
                        <span className="inline-flex items-center gap-1 text-[#001433] text-[13px] bg-[#EBEDF0] rounded-2xl px-3 py-1">
                            <img src={alert} alt="" className="w-4 h-4" />
                            JavaScript
                        </span>
                    </div>
                </div>
            </div>
            {/**Jop Description */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                {/*Mean Header*/}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>

                <h3 className="text-md font-semibold text-gray-800 mb-2">Job Summary</h3>
                <p className="text-gray-700 mb-6">
                    We are seeking an Angular Developer with designing, developing, and maintaining dynamic and responsive web applications using the Angular framework.
                    This role involves working closely with back-end developers, UI/UX designers. The ideal candidate should be skilled in both front-end development and design,
                    with the ability to turn design concepts into working code.
                </p>

                {/* Details */}
                <h3 className="text-md font-semibold text-gray-800 mb-2">Job description</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">
                    <li>
                        <span className="font-semibold">Develop responsive web applications using Angular. (preferably Angular 17)</span>
                    </li>
                    <li>
                        <span className="font-semibold">Convert designs from Figma to CSS</span> and ensure they look great across all devices.
                    </li>
                    <li>
                        Work closely with back-end developers to integrate APIs and ensure seamless data flow between the front-end and back-end systems.
                    </li>
                    <li>Ensure consistency and usability in the UI and UX of the web applications.</li>
                    <li>Writing clean code.</li>
                    <li>Optimize applications for speed and performance.</li>
                    <li>Debug and troubleshoot front-end issues.</li>
                </ul>
            </div>
            {/**Jop Requirments */}
            <div className="bg-white p-6 rounded shadow-sm m-5">
                {/*Mean Header*/}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Jop Requirments</h2>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Job description</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 pl-4">

                    <li>+3 years of experience</li>
                    <li>Bachelor’s degree in Computer Science, Information Technology, or a related field</li>
                    <li>Strong knowledge of  <span className="font-semibold">Angular</span> and <span className="font-semibold">TypeScript</span></li>
                    <li>Strong knowledge in <span className="font-semibold">javascript, typescript</span>
                        <span className="font-semibold">Solid experience in html, css, scss, bootstrap and responsive design</span>
                    </li>
                    <li>Familiarity with design tools like <span className="font-semibold">Figma</span>and the ability to convert designs into clean, working code.</li>
                    <li>Knowledge in using GIT</li>
                    <li>Good knowledge of REST APIs, JSON, and handling data integration with APIs</li>
                    <li>Excellent problem-solving abilities and attention to detail.</li>
                    <li>Strong communication skills, with the ability to collaborate effectively with cross-functional teams</li>

                </ul>
            </div>
        </div>
    );
}
