import React from "react";
import {
  PlusCircleIcon,
  FileTextIcon,
  CheckSquareIcon,
  UsersIcon,
} from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md">
        <PlusCircleIcon className="w-5 h-5" />
        <span>Add New Job</span>
      </button>
      <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-md">
        <FileTextIcon className="w-5 h-5" />
        <span>Add MCQ Exam</span>
      </button>
      <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md">
        <CheckSquareIcon className="w-5 h-5" />
        <span>Add Task</span>
      </button>
      <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md">
        <UsersIcon className="w-5 h-5" />
        <span>View Responses</span>
      </button>
    </div>
  );
}