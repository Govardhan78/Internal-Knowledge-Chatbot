import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.token, res.user);
      navigate(res.user.role === "admin" ? "/admin" : "/chat");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md bg-surface border border-border rounded-xl px-9 py-10 shadow-2xl text-center">

        <div className="text-4xl mb-3">⚡</div>
        <h1 className="text-2xl font-bold text-heading mb-1">KnowledgeBot</h1>
        <p className="text-sm text-muted mb-7">Sign in to your account</p>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-[rgba(255,92,108,0.1)] border border-[rgba(255,92,108,0.3)] text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={form.email}
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-surface2 border border-border text-heading text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="px-3.5 py-2.5 rounded-lg bg-surface2 border border-border text-heading text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-3 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
