import { useState } from "react";
import QuestionCard from "./QuestionCard";
import QuestionModal from "./QuestionModal";

const AllQuestions = ({ questions, completed, onSubmit }) => {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const handleSubmit = (isCorrect) => {
    if (activeQuestion) {
      onSubmit(activeQuestion.id);
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard key={q.id} question={q} onTake={() => setActiveQuestion(q)} />
      ))}
      {activeQuestion && (
        <QuestionModal
          question={activeQuestion}
          onClose={() => setActiveQuestion(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default AllQuestions;
