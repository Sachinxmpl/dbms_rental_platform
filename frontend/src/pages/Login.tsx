import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { toast } from "../hooks/useToast";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token, user } = await authApi.login(form);
      setAuth(user, token);
      toast("Welcome back, " + user.name.split(" ")[0] + "!", "success");
      navigate("/items");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Invalid credentials");
      } else {
        setError("Semething went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "linear-gradient(160deg, var(--bg) 0%, #FFF0E6 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Sign in to your Sajilorent account
          </p>
        </div>
        <Card>
          <form
            onSubmit={submit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {error && (
              <div
                style={{
                  background: "#FEE2E2",
                  color: "#DC2626",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>
          <p
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}
          >
            No account?{" "}
            <Link
              to="/register"
              style={{ color: "var(--orange)", fontWeight: 600 }}
            >
              Join free
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
