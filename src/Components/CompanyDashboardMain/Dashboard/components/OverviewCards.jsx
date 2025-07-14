import React from "react";
import {
  BriefcaseIcon,
  UsersIcon,
  FileTextIcon,
  CheckSquareIcon,
} from "lucide-react";

export function OverviewCards() {
  const cards = [
    {
      title: "Active Job Posts",
      value: "12",
      icon: <BriefcaseIcon className="w-6 h-6 text-white" />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Total Applications",
      value: "147",
      icon: <UsersIcon className="w-6 h-6 text-white" />,
      bgColor: "bg-green-500",
    },
    {
      title: "Exams Created",
      value: "8",
      icon: <FileTextIcon className="w-6 h-6 text-white" />,
      bgColor: "bg-purple-500",
    },
    {
      title: "Tasks Created",
      value: "15",
      icon: <CheckSquareIcon className="w-6 h-6 text-white" />,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-md shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div
              className={`${card.bgColor} w-12 h-12 rounded-md flex items-center justify-center`}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}