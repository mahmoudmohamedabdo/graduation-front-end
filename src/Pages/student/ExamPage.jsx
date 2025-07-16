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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, , rawSeconds] = useCountdown(600);
  const { id: trackId } = useParams();

  useEffect(() => {
    if (!trackId) {
      setError("Track ID is missing!");
      setLoading(false);
      return;
    }

    const fetchQuestionsAndOptions = async () => {
      try {
        const response = await axios.get(`/api/TrackQuestions/active/by-track/${trackId}`);
        if (!response.data.success || !Array.isArray(response.data.data)) {
          setError("No questions returned from API");
          return;
        }

        const questionsData = response.data.data;

        const questionsWithOptions = await Promise.all(
          questionsData.map(async (question) => {
            try {
              const optionsResponse = await axios.get(`/api/TrackQuestions/with-options/${question.id}`);
              if (optionsResponse.data.success) {
                return {
                  ...question,
                  options: optionsResponse.data.data.options || [],
                };
              }
              return { ...question, options: [] };
            } catch (err) {
              console.error(`Error fetching options for question ${question.id}:`, err);
              return { ...question, options: [] };
            }
          })
        );

        setQuestions(questionsWithOptions);
      } catch (error) {
        setError("Error fetching questions: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndOptions();
  }, [trackId]);

  const handleQuestionSubmit = (questionId, isCorrect) => {
    if (!completed.some((q) => q.id === questionId)) {
      setCompleted((prev) => [
        ...prev,
        { id: questionId, status: isCorrect ? "correct" : "wrong" },
      ]);
    }
  };

  const percentage = questions.length > 0 ? Math.round((completed.length / questions.length) * 100) : 0;

  if (loading) {
    return <div className="text-center text-gray-500">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
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
        onTake={(q) => setActiveQuestion(q)}
        onSubmit={handleQuestionSubmit}
      />
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
          onSubmit={handleQuestionSubmit}
        />
      )}
    </div>
  );
};

export default ExamPage;