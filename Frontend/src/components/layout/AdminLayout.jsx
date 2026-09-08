import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { classNames } from "../../utils/helpers";

const tabClasses = ({ isActive }) =>
  classNames(
    "px-4 py-2 text-sm font-medium border-b-2 transition-colors duration-150",
    isActive
      ? "border-primary text-primary font-semibold"
      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-border"
  );

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      <Navbar />
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-6 border-b border-border">
          <div className="flex items-center justify-between pb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-100">Admin Control Center</h1>
              <p className="text-xs text-muted mt-0.5">
                Manage user access permissions and automated word moderation
              </p>
            </div>
          </div>

          <nav className="flex gap-4 -mb-px">
            <NavLink to="/admin/users" className={tabClasses}>
              User Moderation
            </NavLink>
            <NavLink to="/admin/blocked-words" className={tabClasses}>
              Blocked Words
            </NavLink>
          </nav>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
