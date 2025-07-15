// // import { useState } from "react";
// // import AnswerFeedback from "./AnswerFeedback";

// // const QuestionModal = ({ question, onClose, onSubmit }) => {
// //   const [selectedOption, setSelectedOption] = useState("");
// //   const [submitted, setSubmitted] = useState(false);
// //   const [feedbackData, setFeedbackData] = useState(null);

// //   const handleSubmit = () => {
// //     const isCorrect = selectedOption === question.correctAnswer;
// //     const feedback = {
// //       correct: isCorrect,
// //       correctAnswer: question.correctAnswer,
// //       userAnswer: selectedOption,
// //       explanation: question.explanation,
// //     };
// //     setFeedbackData(feedback);
// //     setSubmitted(true);
// //     onSubmit(question.id, isCorrect);
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur">
// //       <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 relative">
// //         <button
// //           onClick={onClose}
// //           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
// //         >
// //           &times;
// //         </button>

// //         <div className="mb-6">
// //           <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">
// //             {question.difficulty}
// //           </span>
// //           <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
// //             {question.topic}
// //           </span>
// //         </div>

// //         <h2 className="text-lg font-bold mb-1">{question.title}</h2>
// //         <p className="text-sm text-gray-500 mb-5">{question.description}</p>

// //         {!submitted ? (
// //           question.options.length > 0 ? (
// //             <div className="space-y-3 mb-6">
// //               {question.options.map((opt, index) => (
// //                 <label
// //                   key={index}
// //                   className={`flex items-center border rounded-xl px-4 py-3 cursor-pointer transition ${
// //                     selectedOption === opt
// //                       ? "border-blue-500 bg-blue-50"
// //                       : "border-gray-200"
// //                   }`}
// //                 >
// //                   <input
// //                     type="radio"
// //                     name="option"
// //                     className="mr-3 accent-blue-600"
// //                     value={opt}
// //                     checked={selectedOption === opt}
// //                     onChange={() => setSelectedOption(opt)}
// //                   />
// //                   <span className="text-sm">{opt}</span>
// //                 </label>
// //               ))}
// //             </div>
// //           ) : (
// //             <textarea
// //               rows={4}
// //               className="w-full border rounded-xl px-4 py-3 text-sm mb-6"
// //               placeholder="Type your answer here..."
// //               value={selectedOption}
// //               onChange={(e) => setSelectedOption(e.target.value)}
// //             />
// //           )
// //         ) : (
// //           <AnswerFeedback feedback={feedbackData} onClose={onClose} />
// //         )}

// //         {!submitted && (
// //           <div className="flex justify-end">
// //             <button
// //               onClick={handleSubmit}
// //               disabled={!selectedOption}
// //               className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
// //             >
// //               Submit Answer
// //             </button>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default QuestionModal;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { FaTimes } from "react-icons/fa";
// import AnswerFeedback from "./AnswerFeedback";

// const QuestionModal = ({ question, onClose }) => {
//   const [options, setOptions] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [feedbackData, setFeedbackData] = useState(null);

//   useEffect(() => {
//     if (!question) return;

//     const token = localStorage.getItem("authToken");
//     if (!token) return;

//     axios
//       .get(
//         `http://fit4job.runasp.net/api/TrackQuestions/with-options/${question.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((res) => {
//         const apiOptions = res.data?.data?.options || [];
//         setOptions(apiOptions);
//       })
//       .catch((err) => {
//         console.error("Error fetching options:", err);
//       });
//   }, [question]);

//   const handleSubmitAnswer = async () => {
//     const token = localStorage.getItem("authToken");
//     if (!token || !question) return;

//     try {
//       const correctRes = await axios.get(
//         `http://fit4job.runasp.net/api/TrackQuestionOptions/correct/by-question/${question.id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const correctAnswers = correctRes.data?.data || [];

//       const isCorrect = correctAnswers.some(
//         (opt) => opt.id === selectedOption?.id
//       );

//       setFeedbackData({
//         correct: isCorrect,
//         userAnswer: selectedOption?.optionText,
//         correctAnswer: correctAnswers.map((a) => a.optionText).join(", "),
//         explanation: question.explanation || "",
//       });
//     } catch (err) {
//       console.error("Error fetching correct answer:", err);
//     }
//   };

//   if (!question) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
//       <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
//         >
//           <FaTimes size={18} />
//         </button>

//         {!feedbackData ? (
//           <>
//             <h2 className="text-xl font-bold mb-4 text-gray-800">{question.title}</h2>

//             <div className="space-y-3">
//               {options.map((opt) => (
//                 <button
//                   key={opt.id}
//                   onClick={() => setSelectedOption(opt)}
//                   className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
//                     selectedOption?.id === opt.id
//                       ? "border-blue-500 bg-blue-50"
//                       : "border-gray-200"
//                   }`}
//                 >
//                   {opt.optionText}
//                 </button>
//               ))}
//             </div>

//             <div className="flex justify-end mt-6 gap-4">
//               <button
//                 onClick={handleSubmitAnswer}
//                 disabled={!selectedOption}
//                 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
//               >
//                 Submit Answer
//               </button>
//             </div>
//           </>
//         ) : (
//           <AnswerFeedback
//             feedback={feedbackData}
//             onClose={() => setFeedbackData(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuestionModal;





import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import AnswerFeedback from "./AnswerFeedback";

const QuestionModal = ({ question, onClose, onAnswered }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);

  useEffect(() => {
    if (!question) return;

    const token = localStorage.getItem("authToken");
    if (!token) return;

    axios
      .get(
        `http://fit4job.runasp.net/api/TrackQuestions/with-options/${question.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        const apiOptions = res.data?.data?.options || [];
        setOptions(apiOptions);
      })
      .catch((err) => {
        console.error("Error fetching options:", err);
      });
  }, [question]);

  const handleSubmitAnswer = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !question) return;

    try {
      const correctRes = await axios.get(
        `http://fit4job.runasp.net/api/TrackQuestionOptions/correct/by-question/${question.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const correctAnswers = correctRes.data?.data || [];

      const isCorrect = correctAnswers.some(
        (opt) => opt.id === selectedOption?.id
      );

      setFeedbackData({
        correct: isCorrect,
        userAnswer: selectedOption?.optionText,
        correctAnswer: correctAnswers.map((a) => a.optionText).join(", "),
        explanation: question.explanation || "",
      });

      // Notify parent about answer result
      if (onAnswered) {
        onAnswered({
          questionId: question.id,
          isCorrect,
        });
      }
    } catch (err) {
      console.error("Error fetching correct answer:", err);
    }
  };

  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={18} />
        </button>

        {!feedbackData ? (
          <>
            <h2 className="text-xl font-bold mb-4 text-gray-800">{question.title}</h2>

            <div className="space-y-3">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                    selectedOption?.id === opt.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  {opt.optionText}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                Submit Answer
              </button>
            </div>
          </>
        ) : (
          <AnswerFeedback
            feedback={feedbackData}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
