import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewJops({ job }) {
  const navigate = useNavigate();
  const openJopDetailsPage = () => {
    navigate(`/jopDetails/${job.id}`, { state: { jobId: job.id } });
  };

  const title = job.title || 'Unnamed Job';
  const companyName = 'Tech Company';
  const experience = job.yearsOfExperience || '3-5 Yrs of Exp';
  const requirements = job.requirements || 'No requirements available';
  const skills = requirements.split(/·|,/).filter((skill) => skill.trim()).slice(0, 6);

  return (
    <div className="w-72 h-[380px] rounded-xl overflow-hidden shadow-md bg-base-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#298DE0] to-[#006AC2] p-4 rounded-t-xl">
        <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
        <p className="text-white text-sm tracking-wider">{companyName}</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4">
        {/* Job Info */}
        <div className="text-sm text-gray-800 space-y-2">
          <p>{`Experienced (Non-Manager) · ${experience} · ${requirements}`}</p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-[#E6EEFF] text-sm px-3 py-1 rounded-full">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Apply Button at the bottom */}
        <div className="text-center mt-4">
          <button
            className="btn w-full rounded-full text-white bg-[#1C79EA]"
            onClick={openJopDetailsPage}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
