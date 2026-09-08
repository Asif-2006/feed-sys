import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-border py-4 text-center text-xs text-muted">
        FeedSys &copy; {new Date().getFullYear()} — Moderated Community Feed
      </footer>
    </div>
  );
}
