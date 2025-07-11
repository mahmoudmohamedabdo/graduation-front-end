import logo from '../../../assets/Images/logo.png'
import Duration from '../../../assets/Images/duration.png'
import level from '../../../assets/Images/level.png'
import { useNavigate } from 'react-router-dom';

export default function CourseCard() {
      const navigate = useNavigate();
    const openTrackPage=()=>
    {
        navigate('/track')
    }
    return (
        <div className="w-96 rounded-lg overflow-hidden shadow-sm bg-base-100">
            <div className="card-body p-0">
                {/* Top Header */}
                <div className="bg-gradient-to-r from-[#004EFF] to-[#3199DA] p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <img src={logo} className="w-8 h-8" alt="" />
                        <h2 className="text-2xl font-bold text-white">UI/UX Design</h2>
                    </div>
                    <p className="text-white text-sm leading-relaxed">
                        Create beautiful, user-centered designs with industry-standard tools and methodologies.
                    </p>
                </div>

                {/* Course Info */}
                <ul className="mt-6 px-4 flex flex-col gap-3 text-sm text-gray-800">
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

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-3 px-4">
                    {["Figma", "Adobe XD", "Prototyping", "User Research"].map((skill, index) => (
                        <span key={index} className="bg-[#E6EEFF] text-sm px-3 py-1 rounded-full w-fit">
                            {skill}
                        </span>
                    ))}
                </div>

                {/* Button */}
                <div className="mt-6 px-4 pb-4">
                    <button className="btn w-full rounded-2xl text-white bg-[#1C79EA] hover:bg-blue-700" onClick={openTrackPage}>
                        Start Learning
                    </button>
                </div>
            </div>
        </div>
    );
}
