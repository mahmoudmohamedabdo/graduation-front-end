// AllQuestions.jsx
import { MdClose } from "react-icons/md";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { LuRefreshCcw } from "react-icons/lu";

const AllQuestions = ({ questions, completed, onTake }) => {
  const getStatus = (questionId) => {
    const q = completed.find((c) => c.id === questionId);
    return q ? q.status : null;
  };

  const getStatusIcon = (status) => {
    if (status === "correct") return <IoMdCheckmarkCircle className="text-blue-600 text-base" />;
    if (status === "wrong") return <MdClose className="text-red-600 text-base" />;
    return <LuRefreshCcw className="text-gray-400 text-base" />;
  };

  return (
    <div className="space-y-5 mt-6">
      {questions.map((question) => {
        const status = getStatus(question.id);
        const answered = completed.find((c) => c.id === question.id);
        const ratioText = answered ? `1/1` : `0/1`;

        const ratioColor =
          status === "correct" ? "text-blue-600"
            : status === "wrong" ? "text-red-600"
              : "text-gray-400";

        return (
          <div
            key={question.id}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {question.difficulty}
                  </span>
                  <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {question.topic}
                  </span>
                </div>
                <h4 className="font-bold text-md text-gray-900 mb-1">{question.title}</h4>
                <p className="text-sm text-gray-500">{question.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className={`flex items-center gap-1 text-sm font-semibold ${ratioColor}`}>
                  {ratioText}
                  {getStatusIcon(status)}
                </div>
                {question.isNew && (
                  <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => onTake(question)}
                className="border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium rounded-xl text-sm px-5 py-2.5 flex items-center gap-2 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Take Question
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllQuestions;
