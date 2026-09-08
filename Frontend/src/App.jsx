import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import UploadTaskWidget from "./components/feed/UploadTaskWidget";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Feed from "./pages/Feed";
import AdminUsers from "./pages/AdminUsers";
import AdminBlockedWords from "./pages/AdminBlockedWords";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public & User Routes inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated Feed Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/feed" element={<Feed />} />
          </Route>
        </Route>

        {/* Admin Protected Routes inside AdminLayout */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/blocked-words" element={<AdminBlockedWords />} />
          </Route>
        </Route>

        {/* 404 Catch-All */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      {/* Global Floating Background Upload Tasks */}
      <UploadTaskWidget />
    </>
  );
}
