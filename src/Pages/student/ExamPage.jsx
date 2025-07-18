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

  // بيانات المسار
  const [trackInfo, setTrackInfo] = useState({ name: '', category: '', description: '' });

  // إضافة حالة للأسئلة المحلولة محلياً
  const [localCompleted, setLocalCompleted] = useState([]);

  // عند تحميل الصفحة، استرجع الأسئلة المحلولة من localStorage
  useEffect(() => {
    const completedFromStorage = JSON.parse(localStorage.getItem(`completedQuestions_${trackId}`)) || [];
    setLocalCompleted(completedFromStorage);
  }, [trackId]);

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

  useEffect(() => {
    if (!trackId) {
      setError("Track ID is missing!");
      setLoading(false);
      return;
    }

    // جلب بيانات المسار
    const fetchTrackInfo = async () => {
      try {
        const response = await axios.get(`/api/Tracks/${trackId}`);
        if (response.data && response.data.data) {
          setTrackInfo({
            name: response.data.data.name || '',
            category: response.data.data.categoryName || '',
            description: response.data.data.description || '',
          });
        }
      } catch (err) {
        // تجاهل الخطأ هنا، فقط اجعل البيانات فارغة
        setTrackInfo({ name: '', category: '', description: '' });
      }
    };
    fetchTrackInfo();
  }, [trackId]);

  const handleQuestionSubmit = (questionId, isCorrect) => {
    if (!completed.some((q) => q.id === questionId)) {
      setCompleted((prev) => [
        ...prev,
        { id: questionId, status: isCorrect ? "correct" : "wrong" },
      ]);
    }
    // أضف السؤال إلى قائمة الأسئلة المحلولة في localStorage
    setLocalCompleted((prev) => {
      if (!prev.includes(questionId)) {
        const updated = [...prev, questionId];
        localStorage.setItem(`completedQuestions_${trackId}`, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  // Calculate unique completed questions
  const questionsCompleted = localCompleted.length;

  const percentage = questions.length > 0 ? Math.round((questionsCompleted / questions.length) * 100) : 0;

  if (loading) {
    return <div className="text-center text-gray-500">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  const handleTakeQuestion = (question) => {
  setActiveQuestion(question); // Set the active question
};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <HeaderStats
        trackName={trackInfo.name}
        questionsCompleted={questionsCompleted}
        totalQuestions={questions.length}
        percentage={percentage}
        trackId={trackId}
        trackCategory={trackInfo.category}
        trackDescription={trackInfo.description}
      />
      <AllQuestions
        questions={questions}
        completed={completed}
        onTake={(q) => setActiveQuestion(q)}
        onSubmit={handleQuestionSubmit}
        localCompleted={localCompleted}
        setLocalCompleted={setLocalCompleted}
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