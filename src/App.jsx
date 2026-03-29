// src/App.jsx  ── UPDATED ──────────────────────────────────────────────────
// Changes vs previous version:
//  1. Import LoginPage
//  2. useState for `user` (null = logged out)
//  3. Role-based tab visibility
//  4. Nav shows user avatar + role badge + logout button
//  5. Pass `user` prop to pages that need it for further permission checks
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { SEED_TICKETS, EMP_STATUS, COLORS, isOverdue } from "./data";
import AdminPage      from "./components/AdminPage";
import SupervisorPage from "./components/SupervisorPage";
import HoursPage      from "./components/HoursPage";
import EmployeePage   from "./components/EmployeePage";
import ChatPanel      from "./components/ChatPanel";
import LoginPage      from "./components/loginpage";   // ← NEW

// ── Which tabs each role can see ──────────────────────────────────────────────
const ROLE_TABS = {
  admin: [
    { id: "admin",      label: "Admin"      },
    { id: "supervisor", label: "Supervisor" },
    { id: "hours",      label: "Work Hours" },
    { id: "employee",   label: "My Portal"  },
  ],
  supervisor: [
    { id: "supervisor", label: "Supervisor" },
    { id: "employee",   label: "My Portal"  },
  ],
  employee: [
    { id: "employee",   label: "Dashboard"  },
  ],
};

const PAGE_TITLES = {
  admin:      "Admin Dashboard",
  supervisor: "Supervisor View",
  hours:      "Work Hours & Attendance",
  employee:   "My Portal",
};

const ROLE_BADGE = {
  admin:      { bg: "#E6F1FB", tc: "#185FA5", label: "Admin"      },
  supervisor: { bg: "#EEEDFE", tc: "#534AB7", label: "Supervisor" },
  employee:   { bg: "#EAF3DE", tc: "#3B6D11", label: "Employee"   },
};

export default function App() {
  const [user,    setUser]    = useState(null);          // ← NEW
  const [tab,     setTab]     = useState("admin");
  const [tickets, setTickets] = useState([...SEED_TICKETS]);
  const [clock,   setClock]   = useState("");

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Handle login ────────────────────────────────────────────────────────────
  const handleLogin = (loggedInUser) => {                // ← NEW
    setUser(loggedInUser);
    // Set default tab for role
    const tabs = ROLE_TABS[loggedInUser.role];
    setTab(tabs[0].id);
  };

  // ── Handle logout ───────────────────────────────────────────────────────────
  const handleLogout = () => {                           // ← NEW
    setUser(null);
    setTab("admin");
  };

  // ── Show login page if not authenticated ────────────────────────────────────
  if (!user) return <LoginPage onLogin={handleLogin} />;  // ← NEW

  const tabs       = ROLE_TABS[user.role];
  const alertCount = tickets.filter(isOverdue).length +
                     tickets.filter((t) => t.escalated && t.status !== "Done").length;
  const roleBadge  = ROLE_BADGE[user.role];

  return (
    <div style={{ minHeight: "100vh", background: "#f8f8f6", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid #e8e8e5",
        padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.blue }} />
          <span style={{ fontSize: 17, fontWeight: 900, color: "#111", letterSpacing: "-0.3px" }}>TeamTrack</span>
          <span style={{ fontSize: 17, fontWeight: 300, color: "#bbb" }}>Pro</span>
        </div>

        {/* Tabs — role-filtered */}
        <div style={{ display: "flex", gap: 4 }}>
          {tabs.map((t) => {
            const active  = tab === t.id;
            const showDot = t.id === "supervisor" && alertCount > 0;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "7px 18px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
                border:     `1.5px solid ${active ? COLORS.blue : "transparent"}`,
                background: active ? COLORS.blue : "transparent",
                color:      active ? "#fff" : "#555",
                position: "relative", transition: "all .15s",
              }}>
                {t.label}
                {showDot && (
                  <span style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#E24B4A" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side: clock + user info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#999", fontFamily: "monospace" }}>{clock}</span>

          {/* Role badge */}                                               {/* ← NEW */}
          <span style={{ background: roleBadge.bg, color: roleBadge.tc, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
            {roleBadge.label}
          </span>

          {/* User avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: user.color, color: user.tc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
              {user.av}
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#222" }}>{user.name}</span>
          </div>

          {/* Logout */}                                                   {/* ← NEW */}
          <button onClick={handleLogout} style={{
            background: "#f5f5f3", color: "#555", border: "1px solid #ddd",
            borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700,
            cursor: "pointer",
          }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── PAGE ── */}
      <main style={{ padding: "24px 28px", maxWidth: 1340, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111", margin: 0 }}>{PAGE_TITLES[tab]}</h1>
          <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Pass user to pages so they can apply further permission checks */}
        {tab === "admin"      && <AdminPage      tickets={tickets} setTickets={setTickets} user={user} />}
        {tab === "supervisor" && <SupervisorPage tickets={tickets} setTickets={setTickets} user={user} />}
        {tab === "hours"      && <HoursPage      user={user} />}
        {tab === "employee"   && <EmployeePage   tickets={tickets} user={user} />}
      </main>

      <ChatPanel tickets={tickets} empStatus={EMP_STATUS} />
    </div>
  );
}