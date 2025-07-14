import logo from '../../../assets/Images/logo.png';
import Duration from '../../../assets/Images/duration.png';
import level from '../../../assets/Images/level.png';
import { useNavigate } from 'react-router-dom';

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const openTrackPage = () => {
    navigate(`/track/${course.id}`);
  };

  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-sm bg-base-100 flex-shrink-0">
      <div className="card-body p-0" style={{ height: '440px', display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <div
          className="bg-gradient-to-r from-[#004EFF] to-[#3199DA] p-4"
          style={{
            height: '140px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            color: 'white',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} className="w-8 h-8" alt="" />
            <h2 className="text-xl font-bold">{course.name}</h2>
          </div>
          <p className="text-sm leading-relaxed">{course.description}</p>
        </div>

        {/* Info and Skills */}
        <div
          className="mt-6 px-4 flex-grow overflow-y-auto text-gray-800"
          style={{ maxHeight: '300px' }}
        >
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-2">
              <img src={Duration} alt="" className="w-4 h-4" />
              <span>10 weeks</span>
            </li>
            <li className="flex items-center gap-2">
              <img src={level} alt="" className="w-4 h-4" />
              <span>3 Levels</span>
            </li>
            <li className="text-base font-semibold mt-2">You'll Test:</li>
          </ul>

          {/* Display categorySkills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {course.categorySkills && course.categorySkills.length > 0 ? (
              course.categorySkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#E6EEFF] text-sm px-3 py-1 rounded-full w-fit"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-gray-500 text-sm">No skills available</span>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="mt-6 px-4 pb-4">
          <button
            className="btn w-full rounded-2xl text-white bg-[#1C79EA] hover:bg-blue-700"
            onClick={openTrackPage}
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
}