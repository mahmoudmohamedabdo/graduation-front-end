// // AnswerFeedback.jsx
// import { useState } from "react";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// const AnswerFeedback = ({ feedback, onClose }) => {
//   const [showExplanation, setShowExplanation] = useState(false);
//   const isCorrect = feedback.correct;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
//       <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
//         <div className="flex justify-center mb-4">
//           {isCorrect ? (
//             <FaCheckCircle className="text-green-500 text-5xl" />
//           ) : (
//             <FaTimesCircle className="text-red-500 text-5xl" />
//           )}
//         </div>

//         <h2 className={`text-center text-xl font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
//           {isCorrect ? "Excellent!" : "Not Quite Right"}
//         </h2>
//         <p className="text-center text-sm text-gray-600 mb-6">
//           {isCorrect
//             ? "You got it right! Great job."
//             : "Learning opportunity ahead!"}
//         </p>

//         {!isCorrect && (
//           <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
//             <p className="text-sm text-red-700 font-medium">Your Answer</p>
//             <p className="text-base text-red-900">{feedback.userAnswer}</p>
//           </div>
//         )}

//         <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-3">
//           <p className="text-sm text-green-700 font-medium">Correct Answer</p>
//           <p className="text-base text-green-900">{feedback.correctAnswer}</p>
//         </div>

//         <div className="mb-6">
//           <button
//             className="w-full text-left text-sm text-blue-700 hover:underline"
//             onClick={() => setShowExplanation((prev) => !prev)}
//           >
//             {showExplanation ? "Hide" : "Why is this correct?"}
//           </button>
//           {showExplanation && (
//             <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
//               {feedback.explanation}
//             </div>
//           )}
//         </div>

//         <button
//           onClick={onClose}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl"
//         >
//           Continue Learning
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AnswerFeedback;







// AnswerFeedback.jsx
import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AnswerFeedback = ({ feedback, onClose }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const isCorrect = feedback.correct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-center mb-4">
          {isCorrect ? (
            <FaCheckCircle className="text-green-500 text-5xl" />
          ) : (
            <FaTimesCircle className="text-red-500 text-5xl" />
          )}
        </div>

        <h2 className={`text-center text-xl font-semibold mb-1 ${isCorrect ? "text-green-700" : "text-red-700"}`}>
          {isCorrect ? "Excellent!" : "Not Quite Right"}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {isCorrect
            ? "You got it right! Great job."
            : "Learning opportunity ahead!"}
        </p>

        {!isCorrect && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-3">
            <p className="text-sm text-red-700 font-medium">Your Answer</p>
            <p className="text-base text-red-900">{feedback.userAnswer}</p>
          </div>
        )}

        {feedback.correctAnswer && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-3">
            <p className="text-sm text-green-700 font-medium">Correct Answer</p>
            <p className="text-base text-green-900">{feedback.correctAnswer}</p>
          </div>
        )}

        <div className="mb-6">
          <button
            className="w-full text-left text-sm text-blue-700 hover:underline"
            onClick={() => setShowExplanation((prev) => !prev)}
          >
            {showExplanation ? "Hide" : "Why is this correct?"}
          </button>
          {showExplanation && (
            <div className="mt-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
              {feedback.explanation || "No explanation provided."}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
};

export default AnswerFeedback;
