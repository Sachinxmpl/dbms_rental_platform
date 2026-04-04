import { useState } from "react";
import { usersApi } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { toast } from "../hooks/useToast";

export default function Profile() {
  const { user } = useAuth();
  const updateUser = useAuthStore((s) => s.updateUser);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    avatarUrl: user?.avatarUrl ?? "",
  });
  const [idUrl, setIdUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const updated = await usersApi.updateMe(form);
      updateUser(updated);
      toast("Profile updated!", "success");
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const submitVerification = async () => {
    if (!idUrl) return toast("Please enter a valid ID URL", "error");
    setVerifying(true);
    try {
      await usersApi.submitVerification(idUrl);
      updateUser({ verificationStatus: "PENDING" });
      toast("Verification submitted! Under review.", "success");
    } catch {
      toast("Failed to submit", "error");
    } finally {
      setVerifying(false);
    }
  };

  if (!user) return null;

  const verificationConfig = {
    UNVERIFIED: { bg: "#FEF9C3", color: "#854D0E", label: "⚠️ Unverified" },
    PENDING: { bg: "#E0F2FE", color: "#0369A1", label: "🔄 Pending Review" },
    VERIFIED: { bg: "#DCFCE7", color: "#166534", label: "✅ Verified" },
  }[user.verificationStatus];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px" }}>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          fontWeight: 900,
          marginBottom: "32px",
        }}
      >
        My Profile
      </h1>

      {/* Header */}
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        <Avatar name={user.name} url={user.avatarUrl} size={72} />
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700 }}>{user.name}</h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              marginTop: "4px",
            }}
          >
            {user.email}
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "8px",
              alignItems: "center",
            }}
          >
            <Badge bg={verificationConfig.bg} color={verificationConfig.color}>
              {verificationConfig.label}
            </Badge>
            {user.totalRatings > 0 && (
              <span
                style={{ fontSize: "13px", color: "var(--text-secondary)" }}
              >
                ⭐ {user.averageRating.toFixed(1)} ({user.totalRatings} reviews)
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Edit Profile */}
      <Card style={{ marginBottom: "24px" }}>
        <h3 style={{ fontWeight: 700, fontSize: "17px", marginBottom: "20px" }}>
          Edit Profile
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input label="Full Name" value={form.name} onChange={set("name")} />
          <Input
            label="Phone"
            value={form.phone}
            onChange={set("phone")}
            placeholder="98XXXXXXXX"
          />
          <Input
            label="Avatar URL"
            value={form.avatarUrl}
            onChange={set("avatarUrl")}
            placeholder="https://..."
          />
          <Button
            onClick={saveProfile}
            loading={saving}
            style={{ alignSelf: "flex-start" }}
          >
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Verification */}
      {user.verificationStatus !== "VERIFIED" && (
        <Card style={{ borderColor: "#FDE68A", background: "#FFFBF0" }}>
          <h3
            style={{ fontWeight: 700, fontSize: "17px", marginBottom: "8px" }}
          >
            🪪 ID Verification
          </h3>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginBottom: "16px",
              lineHeight: 1.6,
            }}
          >
            You must be verified to rent items. Upload a link to your
            government-issued ID (citizenship, passport, or license).
          </p>
          {user.verificationStatus === "UNVERIFIED" && (
            <div style={{ display: "flex", gap: "12px" }}>
              <Input
                placeholder="https://drive.google.com/your-id-photo"
                value={idUrl}
                onChange={(e) => setIdUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                onClick={submitVerification}
                loading={verifying}
                style={{ whiteSpace: "nowrap" }}
              >
                Submit
              </Button>
            </div>
          )}
          {user.verificationStatus === "PENDING" && (
            <p style={{ fontSize: "14px", color: "#0369A1", fontWeight: 600 }}>
              Your ID is under review. We'll notify you soon.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
