import { useState, useEffect } from "react";
import useCountdown from "../../hooks/useCountdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import axios from "axios";
import AnswerFeedback from "./AnswerFeedback";
import { useParams } from "react-router-dom";

const QuestionModal = ({ question, onClose, onSubmit }) => {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMultiple, setSelectedMultiple] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [timeLeft, reset] = useCountdown(120);
  const { id: selectedTrackId } = useParams();

  useEffect(() => {
    const fetchCorrectAnswer = async () => {
      try {
        const response = await axios.get(`/api/TrackQuestionOptions/correct/by-question/${question.id}`);
        if (response.data.success && response.data.data.length > 0) {
          setCorrectAnswer(response.data.data[0].optionText);
        } else {
          setError("Failed to fetch correct answer");
        }
      } catch (err) {
        setError("Error fetching correct answer: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrectAnswer();
    reset();
  }, [question, reset]);

  /* const handleSubmit = () => {
    const isCorrect = selected === correctAnswer;
    setFeedback({
      correct: isCorrect,
      userAnswer: selected,
      correctAnswer: correctAnswer,
      explanation: question.explanation || "No explanation provided",
    });
    setShowFeedback(true);
    onSubmit(question.id, isCorrect);
  }; */


  const handleSubmit = () => {
    const attemptIdS = localStorage.getItem(`attemptId_${selectedTrackId}`);

    // Check if attemptId exists
    if (!attemptIdS) {
      setError("Attempt ID is missing. Please try again.");
      return;
    }

    let submissionData = {
      attemptId: attemptIdS,
      questionId: question.id,
    };

    let isCorrect = false;


      ///DFGHJKL
    // Determine the type of question and process accordingly
    if (question.questionType === 0 || question.questionType === 5) {
      submissionData.selectedOptions = [selected]; // Single choice or True/False
      isCorrect = selected === correctAnswer; // Check if selected answer is correct
    } else if (question.questionType === 1) {
      submissionData.selectedOptions = selectedMultiple; // Multiple choice
      isCorrect = selectedMultiple.every(option => question.options.some(opt => opt.optionText === option && opt.isCorrect)); // Check if all selected options are correct
    } else if (question.questionType === 2 || question.questionType === 3 || question.questionType === 4) {
      submissionData.textAnswer = textAnswer; // Code output or Fill in the blank
      isCorrect = textAnswer === correctAnswer; // Check if text answer matches the correct answer
    }

    setFeedback({
      correct: isCorrect,
      userAnswer: submissionData.selectedOptions || submissionData.textAnswer,
      correctAnswer: correctAnswer,
      explanation: question.explanation || "No explanation provided",
    });

    setShowFeedback(true);

    // Pass the questionId, isCorrect, and submissionData to onSubmit
    onSubmit(question.id, isCorrect);
  };

  if (!question) return null;
  if (loading) return <p className="text-center text-gray-500">Loading question data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-t-2xl px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Practice Question</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-bold text-md text-gray-900 mb-1">{question.questionText}</h4>
            <p className="text-sm text-gray-500">{question.explanation || "No description available"}</p>
          </div>

          {/* Render based on question type */}
          {question.questionType === 0 && (
            <div className="space-y-3 mb-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
                    <input
                      type="radio"
                      name="answer"
                      value={opt.optionText}
                      onChange={() => setSelected(opt.optionText)}
                      className="mr-3"
                    />
                    {opt.optionText}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No options available for this question</p>
              )}
            </div>
          )}

          {question.questionType === 1 && (
            <div className="space-y-3 mb-6">
              {question.options && question.options.length > 0 ? (
                question.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
                    <input
                      type="checkbox"
                      value={opt.optionText}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMultiple([...selectedMultiple, opt.optionText]);
                        } else {
                          setSelectedMultiple(selectedMultiple.filter((item) => item !== opt.optionText));
                        }
                      }}
                      className="mr-3"
                    />
                    {opt.optionText}
                  </label>
                ))
              ) : (
                <p className="text-gray-500">No options available for this question</p>
              )}
            </div>
          )}

          {question.questionType === 2 && (
            <div className="mb-6">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          )}

          {question.questionType === 3 && (
            <div className="mb-6">
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          )}

          {question.questionType === 4 && (
            <div className="mb-6">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Fill in the blank"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          )}

          {question.questionType === 5 && (
            <div className="space-y-3 mb-6">
              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="answer"
                  value="true"
                  onChange={() => setSelected(true)}
                  className="mr-3"
                />
                True
              </label>
              <label className="flex items-center border rounded-lg px-4 py-3 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="answer"
                  value="false"
                  onChange={() => setSelected(false)}
                  className="mr-3"
                />
                False
              </label>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selected && !textAnswer}
            className={`w-full flex justify-center items-center gap-2 py-2.5 rounded-xl text-white ${selected || textAnswer ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Submit Answer
          </button>

          {showFeedback && <AnswerFeedback feedback={feedback} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;