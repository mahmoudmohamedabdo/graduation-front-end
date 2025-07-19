import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function AddQuestionOptions() {
  const { questionId } = useParams();
  const [form, setForm] = useState({
    optionText: "",
    isCorrect: false,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState([]);

  // Fetch existing options for this question
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`http://fit4job.runasp.net/api/CompanyExamQuestionOptions?questionId=${questionId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (data?.success && data.data) {
            setOptions(Array.isArray(data.data) ? data.data : []);
          } else {
            setOptions([]);
          }
        }
      } catch (err) {
        setOptions([]);
      }
    };
    fetchOptions();
  }, [questionId, success]);

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
      const response = await fetch("http://fit4job.runasp.net/api/CompanyExamQuestionOptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
        },
        body: JSON.stringify({
          questionId: parseInt(questionId),
          ...form,
        }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add option");
      }
      setSuccess(true);
      setForm({ optionText: "", isCorrect: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Option to Question #{questionId}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Option Text *</label>
          <input name="optionText" value={form.optionText} onChange={handleChange} required className="w-full border rounded p-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="isCorrect" checked={form.isCorrect} onChange={handleChange} className="mr-2" />
          <label>Is Correct</label>
        </div>
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isSubmitting ? "Adding..." : "Add Option"}
        </button>
        {success && <div className="text-green-600 mt-2">Option added successfully!</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Current Options:</h3>
        {options.length === 0 ? (
          <div className="text-gray-500">No options added yet.</div>
        ) : (
          <ul className="list-disc pl-5">
            {options.map((opt) => (
              <li key={opt.id} className={opt.isCorrect ? "text-green-700" : ""}>
                {opt.optionText} {opt.isCorrect && <span className="ml-2 text-xs bg-green-200 px-2 py-1 rounded">Correct</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 