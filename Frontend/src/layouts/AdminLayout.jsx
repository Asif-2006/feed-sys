import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { classNames } from "../utils/helpers";

const linkClasses = ({ isActive }) =>
  classNames(
    "rounded-lg px-3.5 py-2 text-sm font-medium transition duration-150",
    isActive ? "bg-primary/15 text-primary" : "text-slate-300 hover:bg-white/5"
  );

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Navbar />
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <nav className="mb-6 flex gap-2 border-b border-border pb-4">
          <NavLink to="/admin/users" className={linkClasses}>
            Manage Users
          </NavLink>
          <NavLink to="/admin/blocked-words" className={linkClasses}>
            Blocked Words
          </NavLink>
        </nav>
        <Outlet />
      </div>
    </div>
  );
}
