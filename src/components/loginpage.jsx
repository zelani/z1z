// src/components/LoginPage.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Demo credentials (replace with Firebase Auth later):
//   admin@teamtrack.com   / admin123    → role: "admin"
//   supervisor@teamtrack.com / super123 → role: "supervisor"
//   priya@teamtrack.com   / emp123      → role: "employee", name: "Priya Sharma"
//   ravi@teamtrack.com    / emp123      → role: "employee", name: "Ravi Kumar"
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

const DEMO_USERS = [
  { email: "admin@teamtrack.com",      password: "admin123", role: "admin",      name: "Admin",        av: "AD", color: "#E6F1FB", tc: "#185FA5" },
  { email: "supervisor@teamtrack.com", password: "super123", role: "supervisor", name: "Supervisor",   av: "SV", color: "#EEEDFE", tc: "#534AB7" },
  { email: "priya@teamtrack.com",      password: "emp123",   role: "employee",   name: "Priya Sharma", av: "PS", color: "#EAF3DE", tc: "#3B6D11" },
  { email: "ravi@teamtrack.com",       password: "emp123",   role: "employee",   name: "Ravi Kumar",   av: "RK", color: "#FAEEDA", tc: "#854F0B" },
  { email: "deepa@teamtrack.com",      password: "emp123",   role: "employee",   name: "Deepa Nair",   av: "DN", color: "#FBEAF0", tc: "#993556" },
  { email: "anita@teamtrack.com",      password: "emp123",   role: "employee",   name: "Anita Rao",    av: "AR", color: "#E1F5EE", tc: "#0F6E56" },
];

const ROLE_META = {
  admin:      { label: "Admin",      bg: "#E6F1FB", tc: "#185FA5", desc: "Full access to all features" },
  supervisor: { label: "Supervisor", bg: "#EEEDFE", tc: "#534AB7", desc: "Tickets, team view, reports"  },
  employee:   { label: "Employee",   bg: "#EAF3DE", tc: "#3B6D11", desc: "My tickets & dashboard"       },
};

export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const user = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );
      if (user) {
        onLogin(user);
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 600);
  };

  const quickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8f8f6",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif", padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#378ADD" }} />
            <span style={{ fontSize: 24, fontWeight: 900, color: "#111", letterSpacing: "-0.5px" }}>TeamTrack</span>
            <span style={{ fontSize: 24, fontWeight: 300, color: "#bbb" }}>Pro</span>
          </div>
          <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Accounting Team Management System</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", border: "1px solid #e8e8e5", borderRadius: 16, padding: "32px 28px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111", margin: "0 0 6px" }}>Welcome back</h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 24px" }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 5 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@teamtrack.com"
                required
                style={{
                  width: "100%", padding: "10px 12px",
                  border: `1px solid ${error ? "#F09595" : "#ddd"}`,
                  borderRadius: 8, fontSize: 13, color: "#222",
                  background: "#fff", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 6 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 5 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%", padding: "10px 40px 10px 12px",
                    border: `1px solid ${error ? "#F09595" : "#ddd"}`,
                    borderRadius: 8, fontSize: 13, color: "#222",
                    background: "#fff", boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#aaa" }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: "#FCEBEB", border: "1px solid #F09595", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#A32D2D", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "11px", marginTop: 8,
                background: loading ? "#aaa" : "#378ADD",
                color: "#fff", border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                transition: "background .2s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 16px" }}>
            <div style={{ flex: 1, height: 1, background: "#eee" }} />
            <span style={{ fontSize: 11, color: "#bbb", fontWeight: 600 }}>QUICK DEMO LOGIN</span>
            <div style={{ flex: 1, height: 1, background: "#eee" }} />
          </div>

          {/* Quick login chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { email: "admin@teamtrack.com",      password: "admin123", role: "admin",      label: "Admin",      sub: "Full access" },
              { email: "supervisor@teamtrack.com", password: "super123", role: "supervisor", label: "Supervisor", sub: "Tickets & team" },
              { email: "priya@teamtrack.com",      password: "emp123",   role: "employee",   label: "Employee",   sub: "Priya Sharma" },
            ].map((u) => {
              const m = ROLE_META[u.role];
              return (
                <button
                  key={u.role}
                  onClick={() => quickLogin(u)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #eee", background: "#fafaf8",
                    cursor: "pointer", textAlign: "left", transition: "border-color .15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#378ADD")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#eee")}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: m.bg, color: m.tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                    {u.role === "admin" ? "AD" : u.role === "supervisor" ? "SV" : "PS"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{u.label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{u.sub} · {u.email}</div>
                  </div>
                  <span style={{ background: m.bg, color: m.tc, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 11, color: "#bbb", marginTop: 18 }}>
          Demo mode · Firebase Auth will replace this in production
        </p>
      </div>
    </div>
  );
}