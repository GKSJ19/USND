import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex">

      <div className="w-64 fixed h-screen bg-blue-900">
        <Sidebar />
      </div>

      <div className="ml-64 w-full p-6 bg-black min-h-screen text-white">
        <Outlet />   {/* 🔥 THIS IS REQUIRED */}
      </div>

    </div>
  );
}