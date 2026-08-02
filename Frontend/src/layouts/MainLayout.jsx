import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
