import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.identifier.trim()) {
      errs.identifier = "Email or username is required.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const isEmail = form.identifier.includes("@");
      const credentials = isEmail
        ? { email: form.identifier.trim(), password: form.password }
        : { username: form.identifier.trim(), password: form.password };

      await login(credentials);
      toast.success("Welcome back!");
      const target = location.state?.from?.pathname || "/feed";
      navigate(target, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Log in to your account to view and share feed posts
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            name="identifier"
            type="text"
            placeholder="you@example.com or username"
            value={form.identifier}
            error={errors.identifier}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, identifier: e.target.value }))
            }
            autoFocus
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            error={errors.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs sm:text-sm text-muted">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
