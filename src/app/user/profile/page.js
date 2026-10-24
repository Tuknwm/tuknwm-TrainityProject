"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNav from "@/components/AppNav";
import { useSession, useMockAuth } from "@/lib/mockAuth";
import { updateUser } from "@/lib/mockStore";

const T = { p2: "#1f2e22", p3: "#141e16", border: "rgba(255,255,255,0.10)", t1: "#ffffff", t2: "rgba(255,255,255,0.65)", t3: "rgba(255,255,255,0.35)", green: "#e1fc9d", greenTxt: "#0f1f0f" };
const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${T.border}`, borderRadius: "8px", padding: "11px 14px", fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t1, outline: "none", width: "100%", boxSizing: "border-box" };
const disabledInput = { ...inputStyle, opacity: 0.4, cursor: "not-allowed" };

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { update } = useMockAuth();
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (session?.user) setFormData({ username: session.user.username, email: session.user.email });
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session?.user) return;
    setIsLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const updated = updateUser(session.user.id, formData);
      update({ ...session.user, username: updated.username, name: updated.username, email: updated.email });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <div style={{ minHeight: "100vh", background: T.p3, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: T.t3, fontFamily: "var(--font-inter)" }}>Loading profile...</p></div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: T.p3 }}>
      <AppNav />
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => router.push("/user/dashboard")} style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t2, background: "none", border: "none", cursor: "pointer", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
          ← Back to Dashboard
        </button>

        <h1 style={{ fontFamily: "var(--font-polysans)", fontSize: "24px", fontWeight: 400, letterSpacing: "-0.5px", color: T.t1, margin: "0 0 4px" }}>Edit Profile</h1>
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: T.t3, margin: "0 0 32px" }}>Manage your profile information</p>

        {message.text && (
          <div style={{ padding: "12px 16px", borderRadius: "8px", marginBottom: "20px", fontFamily: "var(--font-inter)", fontSize: "14px", background: message.type === "success" ? "rgba(134,239,172,0.1)" : "rgba(248,113,113,0.1)", color: message.type === "success" ? "#86efac" : "#f87171", border: `1px solid ${message.type === "success" ? "rgba(134,239,172,0.3)" : "rgba(248,113,113,0.3)"}` }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5 }}>Username</label>
            <input type="text" disabled value={formData.username} placeholder="Enter username" style={disabledInput} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5 }}>Email</label>
            <input type="email" disabled value={formData.email} placeholder="Enter email" style={disabledInput} />
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="submit" disabled style={{ background: "rgba(255,255,255,0.04)", color: T.t3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 24px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "not-allowed", opacity: 0.4 }}>
              Save Changes
            </button>
          </div>
        </form>

        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "32px", marginBottom: "40px" }}>
          <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, color: T.t1, margin: "0 0 4px" }}>Change Password</h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: "0 0 20px" }}>Password change is currently unavailable.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[["Current Password","current-password"],["New Password","new-password"],["Confirm New Password","confirm-password"]].map(([label, id]) => (
              <div key={id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, textTransform: "uppercase", letterSpacing: "0.06em", opacity: 0.5 }}>{label}</label>
                <input type="password" disabled placeholder="••••••••" style={disabledInput} />
              </div>
            ))}
            <button disabled style={{ alignSelf: "flex-end", background: "rgba(255,255,255,0.04)", color: T.t3, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "10px 20px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "not-allowed", opacity: 0.4 }}>
              Update Password
            </button>
          </div>
        </div>

        <div style={{ borderTop: `1px solid rgba(248,113,113,0.15)`, paddingTop: "28px" }}>
          <h2 style={{ fontFamily: "var(--font-polysans)", fontSize: "16px", fontWeight: 400, color: "rgba(248,113,113,0.5)", margin: "0 0 4px" }}>Delete Account</h2>
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: T.t3, margin: "0 0 16px" }}>This action is permanent and cannot be undone. Currently unavailable.</p>
          <button disabled style={{ background: "rgba(248,113,113,0.06)", color: "rgba(248,113,113,0.4)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "8px", padding: "10px 20px", fontFamily: "var(--font-polysans)", fontSize: "14px", cursor: "not-allowed" }}>
            Delete My Account
          </button>
        </div>
      </main>
    </div>
  );
}
