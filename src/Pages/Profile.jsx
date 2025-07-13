import React from "react";
import Navbar from "../layouts/Navbar";
import profile from '../assets/Images/profile.png'
import { FaGithub } from "react-icons/fa";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { FaLinkedin } from "react-icons/fa";

export default function Profile() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center">
                    <img
                        src={profile}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover shadow"
                    />
                    <h1 className="text-lg font-semibold mt-4 text-gray-900">Ahmed Mohamed</h1>
                    <p className="text-sm text-gray-600">Software Engineer</p>
                    <p className="text-sm  mt-1">San Francisco Bay Area</p>
                </div>

                <div className="mt-8 w-full max-w-4xl space-y-6">
                    {/* About */}
                    <section>
                        <h2 className="text-sm font-bold mb-1 text-gray-900">About</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Experienced software engineer with a passion for building scalable and
                            efficient applications. Proven track record of delivering high-quality
                            code and collaborating effectively in team environments. Seeking a
                            challenging role where I can leverage my skills and contribute to
                            innovative projects.
                        </p>
                    </section>

                    {/* Skills */}
                    <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {["Java", "Python", "SQL", "AWS", "Agile", "Problem Solving"].map((skill) => (
                                <span
                                    key={skill}
                                    className="bg-[#F0F2F5] text-[#121417] text-xs px-3 py-[3px] rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Resume Upload */}
                    <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">Resume</h2>
                        <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <HiOutlineDocumentArrowUp/>
                                <span className="text-sm text-gray-800">Upload Resume</span>
                            </div>
                            <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded">
                                Upload
                            </button>
                        </div>
                    </section>

                    {/* External Profiles */}
                    <section>
                        <h2 className="text-sm font-bold mb-2 text-gray-900">External Profiles</h2>
                        <div className="space-y-2">
                            <div className="bg-white border rounded-md p-3 flex items-center justify-between">

                                <div className="flex items-center gap-2">
                                    <FaGithub />
                                    <span className="text-sm text-gray-800">GitHub</span>
                                </div>
                                <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded">
                                    Connect
                                </button>
                            </div>
                            <div className="bg-white border rounded-md p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FaLinkedin />
                                    <span className="text-sm text-gray-800">LinkedIn</span>
                                </div>
                                <div className="flex items-center gap-2">
                                </div>
                                <button className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded">
                                    Connect
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Exam Attempts */}
                    <section>
                        <h2 className="text-sm font-bold mb-1 text-gray-900">Exam Attempts</h2>
                        <p className="text-sm text-gray-600">
                            You have 5 attempts per track. Use them wisely to showcase your skills.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
