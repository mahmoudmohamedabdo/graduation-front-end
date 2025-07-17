import { NavLink } from "react-router-dom";

export default function JopNav({ id }) {
    const baseClass = "pb-2 font-semibold";
    const activeClass = "border-b-2 border-black";

    return (
        <div className="flex gap-20 mt-6 border-b border-gray-300">
            <NavLink
                to={`/jopDetails/${id}`}
                className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : baseClass}
            >
                Details
            </NavLink>
            <NavLink
                to={`/quiz//${id}`}
                className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : baseClass}
            >
                Quiz
            </NavLink>
            <NavLink
                to={`/jopTask//${id}`}
                className={({ isActive }) => isActive ? `${baseClass} ${activeClass}` : baseClass}
            >
                Task
            </NavLink>
        </div>
    );
}
