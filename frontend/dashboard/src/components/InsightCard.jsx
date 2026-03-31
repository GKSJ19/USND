import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#1e3a8a] text-white p-6 fixed">

      {/* TITLE */}
     <h1 className="text-2xl font-bold mb-10">
  Disaster Analytics
     </h1>
      {/* MENU */}
      <nav className="flex flex-col space-y-5">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-gray-200"
          }
        >
          Overview
        </NavLink>

        <NavLink
          to="/approach"
          className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-gray-200"
          }
        >
          Approach
        </NavLink>

        <NavLink
          to="/temporal"
          className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-gray-200"
          }
        >
          Temporal
        </NavLink>

        <NavLink
          to="/geographic"
          className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-gray-200"
          }
        >
          Geographic
        </NavLink>

        <NavLink
          to="/heatmap"
          className={({ isActive }) =>
            isActive ? "text-white font-semibold" : "text-gray-200"
          }
        >
          Heatmap
        </NavLink>

        <NavLink
          to="/incident"
          className={({ isActive }) =>
            isActive ? "text-pink-400 font-semibold" : "text-gray-200"
          }
        >
          Incident Type
        </NavLink>

      </nav>
    </div>
  );
}