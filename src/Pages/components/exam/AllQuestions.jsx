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
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((question) => {
          const status = getStatus(question.id);

          return (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{question.difficultyLevel}</span>
                  </div>
                  <h4 className="font-bold text-md text-gray-900 mb-1">{question.questionText}</h4>
                  <p className="text-sm text-gray-500">{question.explanation}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-1 text-sm font-semibold text-gray-400`}>
                    {status ? `${status}` : `Not Attempted`}
                    {getStatusIcon(status)}
                  </div>
                  <button onClick={() => onTake(question)} className="btn btn-sm rounded-full px-4 bg-[#1C79EA] hover:bg-[#2546EB] text-white">
                    Take Question
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No questions available.</p>
      )}
    </div>
  );
};

export default AllQuestions;
