import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../api/client";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { toast } from "../hooks/useToast";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters");
    setLoading(true);
    setError("");
    try {
      await authApi.register(form);
      toast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)){
        setError(err.response?.data?.message ?? "Registration failed");
      }else {
        setError("Something went wrong ")
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
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              fontWeight: 900,
              marginBottom: "8px",
            }}
          >
            Create your account
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>
            Join thousands of renters and lenders in Nepal
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
              label="Full Name"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Aashish Tamang"
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
            />
            <Input
              label="Phone (optional)"
              value={form.phone}
              onChange={set("phone")}
              placeholder="98XXXXXXXX"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={set("password")}
              placeholder="Min 8 characters"
              hint="Use a strong password"
            />
            <Button type="submit" fullWidth loading={loading}>
              Create account
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
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "var(--orange)", fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
