import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
const HeaderStats = ({ trackName, questionsCompleted, totalQuestions, percentage }) => {
  const navigate=useNavigate()
  const BackToTracks=()=>
  {
navigate('/track')
  }
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <ArrowLeftIcon className="w-5 h-5 text-gray-600 cursor-pointer" onClick={BackToTracks} />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{trackName}</h2>
          <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Front-End Development</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>New to React - Basic concepts and fundamentals</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-blue-600 font-bold text-sm">
            {questionsCompleted}/{totalQuestions}
          </p>
          <p className="text-xs text-gray-500">Questions Completed</p>
        </div>
        <div className="w-14 h-14 border rounded-full flex items-center justify-center">
          <span className="text-sm font-semibold text-blue-600">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default HeaderStats;