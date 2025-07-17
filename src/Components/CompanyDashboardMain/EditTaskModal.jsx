import React, { useState } from "react";
import { motion } from "framer-motion";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [formData, setFormData] = useState({
    id: task?.id || 0,
    title: task?.title || "",
    description: task?.description || "",
    requirements: task?.requirements || "",
    deliverables: task?.deliverables || "",
    deadline: task?.deadline ? task.deadline.split("T")[0] : "",
    estimatedHours: task?.estimatedHours || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estimatedHours" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTask = {
      ...formData,
      deadline: new Date(formData.deadline).toISOString(), 
    };
    onSave(updatedTask);
    alert("Task edited successfully");

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Requirements</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Deliverables</label>
            <textarea
              name="deliverables"
              value={formData.deliverables}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows={2}
              required
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Estimated Hours</label>
              <input
                type="number"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
