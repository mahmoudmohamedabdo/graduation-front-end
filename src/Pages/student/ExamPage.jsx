// import { useState } from "react";
// import HeaderStats from "../components/exam/HeaderStats";
// import AllQuestions from "../components/exam/AllQuestions";
// import QuestionModal from "../components/exam/QuestionModal";
// import useCountdown from "../hooks/useCountdown";






// const questionsData = [
//   {
//     id: 1,
//     title: "What is JSX?",
//     description: "JSX allows writing HTML-like code in JavaScript.",
//     difficulty: "Easy",
//     topic: "Fundamentals",
//     time: "2 min",
//     isNew: true,
//     options: ["true", "false"],
//     correctAnswer: "true",
//     explanation: "JSX lets you write HTML-like elements in React.",
//   },
//   {
//     id: 2,
//     title: "Which hook is used for managing state?",
//     description: "React provides hooks for state and side effects.",
//     difficulty: "Medium",
//     topic: "Hooks",
//     time: "2 min",
//     isNew: true,
//     options: ["useEffect", "useState", "useContext"],
//     correctAnswer: "useState",
//     explanation: "useState manages local state in functional components.",
//   },
//   {
//     id: 3,
//     type: "code",
//     title: "Write a React component",
//     description: "Create a functional component that returns a heading.",
//     difficulty: "Medium",
//     topic: "Code Writing",
//     time: "2 min",
//     isNew: true,
//     options: [],
//     correctAnswer: "function Hello() { return <h1>Hello</h1>; }",
//     explanation: "Basic example of a functional component.",
//   },
// ];

// const ExamPage = () => {
//   const [questions] = useState(questionsData);
//   const [completed, setCompleted] = useState([]);
//   const [activeQuestion, setActiveQuestion] = useState(null);

//   // ضع الـ hook هنا داخل الـ component
//   const [timeLeft, resetTimer, rawSeconds] = useCountdown(600); 

//   const handleQuestionSubmit = (questionId, isCorrect) => {
//     if (!completed.some((q) => q.id === questionId)) {
//       setCompleted((prev) => [
//         ...prev,
//         { id: questionId, status: isCorrect ? "correct" : "wrong" },
//       ]);
//     }
//   };

//   const percentage = Math.round((completed.length / questions.length) * 100);

//   return (
//      <div className="p-6 max-w-6xl mx-auto">
//       <HeaderStats
//         trackName="React - Fresh"
//         questionsCompleted={completed.length}
//         totalQuestions={questions.length}
//         percentage={percentage}
//         timeLeft={timeLeft}  // إضافة الوقت المتبقي في الهيدر
//         rawSeconds={rawSeconds}  // يمكن استخدام rawSeconds لمزيد من التعديلات
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




import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HeaderStats from "../components/exam/HeaderStats";
import AllQuestions from "../components/exam/AllQuestions";
import QuestionModal from "../components/exam/QuestionModal";
import axios from "axios";

const ExamPage = () => {
  const { trackId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [trackData, setTrackData] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token || !trackId) return;

    const fetchQuestions = async () => {
      try {
        console.log("trackId from URL:", trackId);
        const response = await axios.get(
          `http://fit4job.runasp.net/api/TrackQuestions/track/${trackId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data?.data;
        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          console.warn("No questions found or unexpected format", response.data);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    const fetchTrack = async () => {
      try {
        const trackRes = await axios.get(
          `http://fit4job.runasp.net/api/Tracks/${trackId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrackData(trackRes.data?.data);
      } catch (err) {
        console.error("Failed to fetch track data:", err);
      }
    };

    fetchQuestions();
    fetchTrack();
  }, [trackId]);

  const handleQuestionAnswered = (result) => {
    setCompleted((prev) => {
      const exists = prev.find((q) => q.id === result.id);
      if (exists) {
        return prev.map((q) =>
          q.id === result.id ? { ...q, status: result.status } : q
        );
      } else {
        return [...prev, result];
      }
    });
    setCurrentQuestion(null);
  };

  const percentage = questions.length
    ? Math.round((completed.length / questions.length) * 100)
    : 0;

  return (
    <div className="p-6">
      {trackData && (
        <HeaderStats
          trackName={trackData.name}
          questionsCompleted={completed.length}
          totalQuestions={questions.length}
          percentage={percentage}
        />
      )}

      <AllQuestions
        questions={questions}
        completed={completed}
        onTake={setCurrentQuestion}
      />

      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onClose={() => setCurrentQuestion(null)}
          onAnswered={handleQuestionAnswered}
        />
      )}
    </div>
  );
};

export default ExamPage;


