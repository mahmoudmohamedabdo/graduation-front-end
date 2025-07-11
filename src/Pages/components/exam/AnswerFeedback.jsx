const AnswerFeedback = ({ feedback, onClose }) => {
  if (!feedback) return null;

  return (
    <div className={`mt-6 p-4 rounded-md ${feedback.correct ? "bg-green-100" : "bg-red-100"}`}>
      <p className="font-semibold mb-2">
        {feedback.correct ? "Excellent! ✅" : "Not Quite Right ❌"}
      </p>
      <p className="text-sm mb-1">
        Correct Answer: <span className="font-medium">{feedback.correctAnswer}</span>
      </p>
      {!feedback.correct && (
        <p className="text-sm text-gray-700 mb-1">
          Your Answer: <span className="italic">{feedback.userAnswer}</span>
        </p>
      )}
      <p className="text-xs text-gray-700">{feedback.explanation}</p>

      <button className="mt-4 btn btn-outline btn-sm" onClick={onClose}>
        Continue Learning
      </button>
    </div>
  );
};

export default AnswerFeedback;