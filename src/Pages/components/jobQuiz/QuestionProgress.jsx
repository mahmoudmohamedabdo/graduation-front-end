import React from "react";

export default function QuestionProgress({ current, total }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-500 h-2.5 rounded-full transition-all"
        style={{ width: `${(current / total) * 100}%` }}
      ></div>
      <p className="text-sm text-gray-500 mt-1 text-end">
        {current}/{total}
      </p>
    </div>
  );
}
