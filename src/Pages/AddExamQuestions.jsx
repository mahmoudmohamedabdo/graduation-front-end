import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function AddExamQuestions() {
  const { examId } = useParams();
  const [form, setForm] = useState({
    questionText: "",
    questionType: 0,
    points: 1,
    explanation: "",
    codeSnippet: "",
    expectedOutput: "",
    isRequired: true,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError("");
    try {
      const response = await fetch("http://fit4job.runasp.net/api/CompanyExamQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          examId: parseInt(examId),
          ...form,
          points: parseFloat(form.points),
          questionType: parseInt(form.questionType),
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add question");
      }
      const data = await response.json();
      setSuccess(true);
      setForm({
        questionText: "",
        questionType: 0,
        points: 1,
        explanation: "",
        codeSnippet: "",
        expectedOutput: "",
        isRequired: true,
      });
      if (data?.data?.id) {
        window.location.href = `/admin/questions/${data.data.id}/add-options`;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Question to Exam #{examId}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Question Text *</label>
          <textarea name="questionText" value={form.questionText} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Question Type *</label>
          <select name="questionType" value={form.questionType} onChange={handleChange} className="w-full border rounded p-2">
            <option value={0}>Multiple Choice</option>
            <option value={1}>True/False</option>
            <option value={2}>Code</option>
            <option value={3}>Essay</option>
          </select>
        </div>
        <div>
          <label className="block font-medium">Points *</label>
          <input type="number" name="points" value={form.points} onChange={handleChange} min={0} step={0.01} required className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Explanation</label>
          <textarea name="explanation" value={form.explanation} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Code Snippet</label>
          <textarea name="codeSnippet" value={form.codeSnippet} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-medium">Expected Output</label>
          <textarea name="expectedOutput" value={form.expectedOutput} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="isRequired" checked={form.isRequired} onChange={handleChange} className="mr-2" />
          <label>Is Required</label>
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isSubmitting ? "Adding..." : "Add Question"}
        </button>
        {success && <div className="text-green-600 mt-2">Question added successfully!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
} 