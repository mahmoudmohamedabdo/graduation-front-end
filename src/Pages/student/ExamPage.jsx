// // import { useState } from "react";
// // import HeaderStats from "../components/exam/HeaderStats";
// // import AllQuestions from "../components/exam/AllQuestions";
// // import QuestionModal from "../components/exam/QuestionModal";
// // import useCountdown from "../hooks/useCountdown";






// // const questionsData = [
// //   {
// //     id: 1,
// //     title: "What is JSX?",
// //     description: "JSX allows writing HTML-like code in JavaScript.",
// //     difficulty: "Easy",
// //     topic: "Fundamentals",
// //     time: "2 min",
// //     isNew: true,
// //     options: ["true", "false"],
// //     correctAnswer: "true",
// //     explanation: "JSX lets you write HTML-like elements in React.",
// //   },
// //   {
// //     id: 2,
// //     title: "Which hook is used for managing state?",
// //     description: "React provides hooks for state and side effects.",
// //     difficulty: "Medium",
// //     topic: "Hooks",
// //     time: "2 min",
// //     isNew: true,
// //     options: ["useEffect", "useState", "useContext"],
// //     correctAnswer: "useState",
// //     explanation: "useState manages local state in functional components.",
// //   },
// //   {
// //     id: 3,
// //     type: "code",
// //     title: "Write a React component",
// //     description: "Create a functional component that returns a heading.",
// //     difficulty: "Medium",
// //     topic: "Code Writing",
// //     time: "2 min",
// //     isNew: true,
// //     options: [],
// //     correctAnswer: "function Hello() { return <h1>Hello</h1>; }",
// //     explanation: "Basic example of a functional component.",
// //   },
// // ];

// // const ExamPage = () => {
// //   const [questions] = useState(questionsData);
// //   const [completed, setCompleted] = useState([]);
// //   const [activeQuestion, setActiveQuestion] = useState(null);

// //   // ضع الـ hook هنا داخل الـ component
// //   const [timeLeft, resetTimer, rawSeconds] = useCountdown(600); 

// //   const handleQuestionSubmit = (questionId, isCorrect) => {
// //     if (!completed.some((q) => q.id === questionId)) {
// //       setCompleted((prev) => [
// //         ...prev,
// //         { id: questionId, status: isCorrect ? "correct" : "wrong" },
// //       ]);
// //     }
// //   };

// //   const percentage = Math.round((completed.length / questions.length) * 100);

// //   return (
// //      <div className="p-6 max-w-6xl mx-auto">
// //       <HeaderStats
// //         trackName="React - Fresh"
// //         questionsCompleted={completed.length}
// //         totalQuestions={questions.length}
// //         percentage={percentage}
// //         timeLeft={timeLeft}  // إضافة الوقت المتبقي في الهيدر
// //         rawSeconds={rawSeconds}  // يمكن استخدام rawSeconds لمزيد من التعديلات
// //       />



// //       <AllQuestions
// //         questions={questions}
// //         completed={completed}
// //         onTake={(q) => setActiveQuestion(q)}
// //       />

// //       {activeQuestion && (
// //         <QuestionModal
// //           question={activeQuestion}
// //           onClose={() => setActiveQuestion(null)}
// //           onSubmit={handleQuestionSubmit}
// //         />
// //       )}
// //     </div>
// //   );
// // };

// // export default ExamPage;

// import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";  // إضافة استيراد useParams
// import HeaderStats from "../components/exam/HeaderStats";
// import AllQuestions from "../components/exam/AllQuestions";
// import QuestionModal from "../components/exam/QuestionModal";
// import useCountdown from "../hooks/useCountdown";
// import axios from "axios";

// const ExamPage = () => {
//   const [questions, setQuestions] = useState([]);
//   const [completed, setCompleted] = useState([]);
//   const [activeQuestion, setActiveQuestion] = useState(null);
//   const [timeLeft, resetTimer, rawSeconds] = useCountdown(600); 
//   const { id: trackId } = useParams(); // جلب trackId من الـ URL

//   useEffect(() => {
//     if (!trackId) {
//       console.error("Track ID is missing!");
//       return;
//     }

//     // جلب الأسئلة من API باستخدام trackId
//     const fetchQuestions = async () => {
//       try {
//         const response = await axios.get(`/api/TrackQuestions/active/by-track/${trackId}`);
//         console.log("API Response:", response.data);  // التحقق من البيانات القادمة من الـ API

//         // البيانات القادمة هي مصفوفة من الأسئلة في response.data
//         const data = response.data.data; 
//         setQuestions(data);  // تحديث state بالأسئلة
//       } catch (error) {
//         console.error("Error fetching questions:", error);
//       }
//     };

//     fetchQuestions();
//   }, [trackId]);

//   const handleQuestionSubmit = (questionId, isCorrect) => {
//     if (!completed.some((q) => q.id === questionId)) {
//       setCompleted((prev) => [
//         ...prev,
//         { id: questionId, status: isCorrect ? "correct" : "wrong" },
//       ]);
//     }
//   };

//   const percentage = Math.round((completed.length / questions.length) * 100);

//   // التحقق من أنه يوجد أسئلة لعرضها
//   if (!questions || questions.length === 0) {
//     console.log("No questions to display");
//     return <div className="text-center text-gray-500">Loading questions...</div>;
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <HeaderStats
//         trackName="React - Fresh"
//         questionsCompleted={completed.length}
//         totalQuestions={questions.length}
//         percentage={percentage}
//         timeLeft={timeLeft}
//         rawSeconds={rawSeconds}
//       />

//       <AllQuestions
//         questions={questions}
//         completed={completed}
//         onTake={(q) => setActiveQuestion(q)}
//       />

//       {activeQuestion && (
//         <QuestionModal
//           question={activeQuestion}
//           onClose={() => setActiveQuestion(null)}
//           onSubmit={handleQuestionSubmit}
//         />
//       )}
//     </div>
//   );
// };

// export default ExamPage;






















import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import HeaderStats from "../components/exam/HeaderStats";
import AllQuestions from "../components/exam/AllQuestions";
import QuestionModal from "../components/exam/QuestionModal"; 
import useCountdown from "../hooks/useCountdown";
import axios from "axios";

const ExamPage = () => {
  const [questions, setQuestions] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [timeLeft, resetTimer, rawSeconds] = useCountdown(600); 
  const { id: trackId } = useParams(); // جلب trackId من الـ URL

  useEffect(() => {
    if (!trackId) {
      console.error("Track ID is missing!");
      return;
    }

    // جلب الأسئلة من API باستخدام trackId
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/TrackQuestions/active/by-track/${trackId}`);
        console.log("API Response:", response.data);  // التحقق من البيانات القادمة من الـ API

        if (response.data && response.data.data) {
          const data = response.data.data;
          setQuestions(data);  // تحديث البيانات
        } else {
          console.error("No data returned from API");
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [trackId]);

  const handleQuestionSubmit = (questionId, isCorrect) => {
    if (!completed.some((q) => q.id === questionId)) {
      setCompleted((prev) => [
        ...prev,
        { id: questionId, status: isCorrect ? "correct" : "wrong" },
      ]);
    }
  };

  const percentage = Math.round((completed.length / questions.length) * 100);

  // التحقق من أنه يوجد أسئلة لعرضها
  if (!questions || questions.length === 0) {
    console.log("No questions to display");
    return <div className="text-center text-gray-500">No questions available. Please try again later.</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <HeaderStats
        trackName="React - Fresh"
        questionsCompleted={completed.length}
        totalQuestions={questions.length}
        percentage={percentage}
        timeLeft={timeLeft}
        rawSeconds={rawSeconds}
      />

      <AllQuestions
        questions={questions}
        completed={completed}
        onTake={(q) => setActiveQuestion(q)}  // تعيين السؤال النشط
      />

      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}  // عرض السؤال النشط في الـ Modal
          onClose={() => setActiveQuestion(null)}  // إغلاق الـ Modal
          onSubmit={handleQuestionSubmit}
        />
      )}
    </div>
  );
};

export default ExamPage;
