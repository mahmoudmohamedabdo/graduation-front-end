import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const QuestionCard = ({ question, onTake }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start hover:shadow-md transition">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
            {question.difficulty}
          </span>
          <span className="text-xs text-gray-500">{question.topic}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {question.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 max-w-xl">{question.description}</p>

        <button
          onClick={onTake}
          className="flex items-center gap-1 text-blue-600 border border-blue-100 bg-white hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium shadow-sm"
        >
          <CheckCircleIcon className="w-4 h-4" />
          Take Question
        </button>
      </div>

      <div className="text-sm text-gray-500 flex flex-col items-end gap-2">
        <div className="flex items-center gap-1">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span>{question.time}</span>
        </div>
        {question.isNew && (
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
            New
          </span>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;