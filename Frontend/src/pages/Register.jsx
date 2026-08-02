import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { isValidEmail } from "../utils/helpers";

export default function Register() {
  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (form.username.trim().length < 3) next.username = "Username must be at least 3 characters.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const data = await register(form);
      toast.success(data?.message || "Account created — please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Couldn't create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-10">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold text-slate-100">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Join HexiNova in a few seconds.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Username"
            name="username"
            placeholder="janedoe"
            value={form.username}
            error={errors.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 8 characters"
            value={form.password}
            error={errors.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          />
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign up
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
