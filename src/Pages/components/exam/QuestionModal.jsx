
// const QuestionModal = ({ question, onClose, onSubmit }) => {
//   const [selected, setSelected] = useState(null);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const [timeLeft, reset] = useCountdown(120);

//   useEffect(() => {
//     reset();
//   }, [question]);

//   const handleSubmit = async () => {
//     const isCorrect = selected === question.correctAnswer;
//     setFeedback({
//       correct: isCorrect,
//       userAnswer: selected,
//       correctAnswer: question.correctAnswer,
//       explanation: question.explanation,
//     });
//     setShowFeedback(true);
//     onSubmit(isCorrect);
//   };

//   if (!question) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 pointer-events-auto">
//         <div className="bg-gradient-to-r from-white to-blue-50 rounded-t-2xl px-6 py-4 flex justify-between items-center">
//           <h3 className="text-lg font-semibold text-gray-900">Practice Question</h3>
//           <div className="flex items-center gap-1 bg-white shadow px-3 py-1 rounded-md">
//             <IoMdCheckmarkCircleOutline className="text-blue-600 text-sm" />
//             <span className="text-xs font-mono text-gray-700">{timeLeft}</span>
//           </div>
//         </div>

//         <div className="p-6">
//           <div className="mb-4">
//             <h4 className="font-bold text-md text-gray-900 mb-1">{question.title}</h4>
//             <p className="text-sm text-gray-500">{question.description}</p>
//           </div>

//           {!showFeedback && (
//             <div className="space-y-3 mb-6">
//               {question.options.map((opt, idx) => (
//                 <label key={idx} className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
//                   <input
//                     type="radio"
//                     name="answer"
//                     value={opt}
//                     onChange={() => setSelected(opt)}
//                     className="mr-3"
//                   />
//                   {opt}
//                 </label>
//               ))}
//               <button onClick={handleSubmit} className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl">
//                 Submit Answer
//               </button>
//             </div>
//           )}

//           {showFeedback && (
//             <div className={`rounded-xl px-6 py-8 text-center space-y-5 ${feedback.correct ? "bg-green-50" : "bg-red-50"}`}>
//               <div className="flex justify-center">
//                 <div className={`${feedback.correct ? "bg-green-100" : "bg-red-100"} p-3 rounded-full shadow-md`}>
//                   {feedback.correct ? <IoMdCheckmarkCircleOutline className="text-green-600 text-4xl" /> : <MdClose className="text-red-600 text-4xl" />}
//                 </div>
//               </div>
//               <h3 className={`font-bold text-xl ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
//                 {feedback.correct ? "Excellent!" : "Not Quite Right"}
//               </h3>
//               <p className={`text-sm ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
//                 {feedback.correct ? "You got it right! Great job." : "Learning opportunity ahead!"}
//               </p>
//               <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl">
//                 Continue Learning
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionModal;
import { useState, useEffect } from "react";
import useCountdown from "../../hooks/useCountdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import axios from "axios";

const QuestionModal = ({ question, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null); // لتخزين الإجابة المختارة
  const [showFeedback, setShowFeedback] = useState(false); // لتحديد متى يظهر الفيدباك
  const [feedback, setFeedback] = useState(null); // لتخزين الفيدباك
  const [timeLeft, reset] = useCountdown(120); // عد تنازلي لمدة 120 ثانية

  useEffect(() => {
    reset(); // إعادة تعيين العد التنازلي عند تغيير السؤال
  }, [question]);

  console.log("Question Data:", question);  // تحقق من بيانات السؤال

  const handleSubmit = async () => {
    const isCorrect = selected === question.correctAnswer; // مقارنة الإجابة المختارة بالإجابة الصحيحة
    setFeedback({
      correct: isCorrect,
      userAnswer: selected,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
    setShowFeedback(true); // إظهار الفيدباك بعد تقديم الإجابة
    onSubmit(isCorrect); // تمرير النتيجة للـ parent component
  };

  if (!question) return null; // إذا لم يكن هناك سؤال، لا تعرض شيء

  // إذا كانت هناك اختيارات، قم بعرضها، وإلا عرض رسالة للمستخدم
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-t-2xl px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Practice Question</h3>
          <div className="flex items-center gap-1 bg-white shadow px-3 py-1 rounded-md">
            <IoMdCheckmarkCircleOutline className="text-blue-600 text-sm" />
            <span className="text-xs font-mono text-gray-700">{timeLeft}</span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-bold text-md text-gray-900 mb-1">{question.questionText}</h4>
            <p className="text-sm text-gray-500">{question.explanation}</p>
          </div>

          {!showFeedback && (
            <div className="space-y-3 mb-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="answer"
                      value={opt.optionText}
                      onChange={() => setSelected(opt.optionText)} // تحديث القيمة عند اختيار الإجابة
                      className="mr-3"
                    />
                    {opt.optionText}
                  </label>
                ))
              ) : (
                <p>No options available for this question</p> // رسالة للمستخدم إذا كانت الخيارات غير موجودة
              )}
              <button onClick={handleSubmit} className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl">
                Submit Answer
              </button>
            </div>
          )}

          {showFeedback && (
            <div className={`rounded-xl px-6 py-8 text-center space-y-5 ${feedback.correct ? "bg-green-50" : "bg-red-50"}`}>
              <div className="flex justify-center">
                <div className={`${feedback.correct ? "bg-green-100" : "bg-red-100"} p-3 rounded-full shadow-md`}>
                  {feedback.correct ? <IoMdCheckmarkCircleOutline className="text-green-600 text-4xl" /> : <MdClose className="text-red-600 text-4xl" />}
                </div>
              </div>
              <h3 className={`font-bold text-xl ${feedback.correct ? "text-green-700" : "text-red-700"}`}>
                {feedback.correct ? "Excellent!" : "Not Quite Right"}
              </h3>
              <p className={`text-sm ${feedback.correct ? "text-green-700" : "text-red-700"}`} >
                {feedback.correct ? "You got it right! Great job." : "Learning opportunity ahead!"}
              </p>
              <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl">
                Continue Learning
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;




