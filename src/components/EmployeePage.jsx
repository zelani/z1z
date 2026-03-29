// EmployeePage.jsx
import { useState, useEffect } from "react";
import { EMPLOYEES, COLORS, isOverdue } from "../data";
import { Card, SectionTitle, Avatar, StatusBadge, Badge, Btn } from "./ui";

const emp = EMPLOYEES[0]; // Priya Sharma — logged-in employee

export default function EmployeePage({ tickets }) {
  const [loggedIn,   setLoggedIn]   = useState(false);
  const [onBreak,    setOnBreak]    = useState(false);
  const [loginTime,  setLoginTime]  = useState(null);
  const [breakStart, setBreakStart] = useState(null);
  const [totalBreak, setTotalBreak] = useState(0);
  const [elapsed,    setElapsed]    = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      if (loggedIn && loginTime) setElapsed(Date.now() - loginTime);
    }, 5000);
    return () => clearInterval(t);
  }, [loggedIn, loginTime]);

  const netH = loginTime
    ? Math.max(0, elapsed / 3600000 - totalBreak / 60).toFixed(1)
    : "0.0";

  const handleBreak = () => {
    if (!onBreak) {
      setOnBreak(true);
      setBreakStart(Date.now());
    } else {
      setTotalBreak((p) => p + Math.round((Date.now() - breakStart) / 60000));
      setOnBreak(false);
      setBreakStart(null);
    }
  };

  const handleLogout = () => {
    if (onBreak) {
      setTotalBreak((p) => p + Math.round((Date.now() - breakStart) / 60000));
      setOnBreak(false);
    }
    setLoggedIn(false);
  };

  const myTickets = tickets.filter((t) => t.assign === emp.name);

  return (
    <div>
      {/* Profile banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, padding: "18px 22px", background: "#fff", border: "1px solid #e8e8e5", borderRadius: 14 }}>
        <Avatar emp={emp} />
        <div>
          <div style={{ fontSize: 19, fontWeight: 800, color: "#111" }}>{emp.name}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{emp.role} · Employee Portal</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{ background: loggedIn ? "#EAF3DE" : "#f5f5f3", color: loggedIn ? "#3B6D11" : "#888", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
            {loggedIn ? "● Online" : "○ Offline"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Clock card */}
        <Card>
          <SectionTitle>My Time Today</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              ["Clock In",  loginTime ? new Date(loginTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--", COLORS.blue],
              ["Break",     `${totalBreak} min`, "#BA7517"],
              ["Net Hours", `${netH}h`,           "#3B6D11"],
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "#fafaf8", border: "1px solid #eee", borderRadius: 10, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: loggedIn ? 18 : 0 }}>
            <Btn variant="primary" disabled={loggedIn} onClick={() => { setLoggedIn(true); setLoginTime(Date.now()); setElapsed(0); }}>
              Clock In
            </Btn>
            <button disabled={!loggedIn} onClick={handleBreak} style={{
              background: onBreak ? "#FAEEDA" : "#f5f5f3",
              color:      onBreak ? "#854F0B" : "#444",
              border: "1px solid #ddd", borderRadius: 8,
              padding: "8px 18px", fontSize: 13, fontWeight: 700,
              cursor: !loggedIn ? "not-allowed" : "pointer", opacity: !loggedIn ? 0.45 : 1,
            }}>
              {onBreak ? "End Break" : "Start Break"}
            </button>
            <Btn variant="danger" disabled={!loggedIn} onClick={handleLogout}>Clock Out</Btn>
          </div>

          {/* Daily progress */}
          {loggedIn && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#888", marginBottom: 5 }}>
                <span>Daily target (8h)</span>
                <span style={{ fontWeight: 700, color: parseFloat(netH) >= 8 ? "#3B6D11" : "#BA7517" }}>{netH}h / 8h</span>
              </div>
              <div style={{ height: 8, background: "#f0f0ee", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, background: parseFloat(netH) >= 8 ? "#639922" : "#378ADD", width: `${Math.min(100, (parseFloat(netH) / 8) * 100)}%`, transition: "width .4s" }} />
              </div>
            </div>
          )}
        </Card>

        {/* My tickets */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionTitle>My Tickets</SectionTitle>
            <div style={{ display: "flex", gap: 8, fontSize: 12 }}>
              <span style={{ color: "#BA7517", fontWeight: 700 }}>{myTickets.filter((t) => t.status !== "Done").length} open</span>
              <span style={{ color: "#3B6D11", fontWeight: 700 }}>{myTickets.filter((t) => t.status === "Done").length} done</span>
            </div>
          </div>
          {myTickets.map((t) => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f5f5f3", gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.subject}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{t.client} · {t.deadline}</div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <StatusBadge status={t.status} />
                {isOverdue(t) && <Badge label="Overdue" bg="#FCEBEB" tc="#A32D2D" small />}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}