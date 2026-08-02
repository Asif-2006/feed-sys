import { Link } from "react-router-dom";
import Button from "../components/Button/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="text-7xl font-bold text-primary">404</span>
      <h1 className="mt-4 text-xl font-semibold text-slate-100">This page wandered off</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
