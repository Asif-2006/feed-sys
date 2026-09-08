import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <span className="text-6xl font-extrabold text-primary mb-2">404</span>
      <h1 className="text-xl font-bold text-slate-100 mb-2">Page Not Found</h1>
      <p className="text-xs sm:text-sm text-muted max-w-sm mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
