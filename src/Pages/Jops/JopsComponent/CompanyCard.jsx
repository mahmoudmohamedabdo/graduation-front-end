import React from "react";
import company from "../../../assets/Images/company.png";
import { useNavigate } from "react-router-dom";

export default function CompanyCard({ job }) {
  const navigate = useNavigate();

  const showJopDetails = () => {
    navigate(`/jopDetails/${job.id}`, { state: { jobId: job.id } });
  };

  console.log("Job ID in CompanyCard:", job.id);

  // Fallback values if data is missing
  const title = job.title || "Unnamed Job";
  const companyName = job.companyName || "TechCompany"; // Use job.companyName if available
  const location = job.location || "New Cairo, Cairo"; // Use job.location if available
  const experience = job.yearsOfExperience || "3-5 Yrs of Exp";
  const skills = job.requirements || "No requirements available";

  return (
    <div className="flex flex-col items-center">
      <div className="card card-border bg-base-100 w-[45rem] flex-col m-3 p-4">
        <div className="content flex items-center justify-between gap-6">
          {/* Text */}
          <div className="card-body flex-1">
            <div className="flex flex-col items-start">
              {/* Job Title */}
              <h2 className="card-title text-[#1E7CE8]">{title}</h2>

              {/* Company Location */}
              <p className="text-black mt-1">
                {companyName} <span className="text-[#000000B2]">{location}</span>
              </p>

              {/* Skills / Experience */}
              <p className="text-[#00000099] my-3">
                Experienced (Non-Manager) · {experience} · {skills}
              </p>
            </div>

            {/* Apply Button */}
            <div className="card-actions justify-start">
              <button
                className="btn text-white bg-[#1E7CE8] rounded-2xl px-6"
                onClick={showJopDetails}
              >
                View Details
              </button>
            </div>
          </div>

          {/* Company Image */}
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
  );
}