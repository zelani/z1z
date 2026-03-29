// HoursPage.jsx
import { useState, useMemo } from "react";
import { EMPLOYEES, EMP_STATUS, DAYS, generateTimeLog } from "../data";
import { Card, SectionTitle, MetricCard, Avatar, Badge, TH, TD, SelectFilter } from "./ui";

const STATUS_BG = { Online: "#EAF3DE", "On Break": "#FAEEDA", "Logged Out": "#f5f5f3" };
const STATUS_TC = { Online: "#3B6D11", "On Break": "#854F0B", "Logged Out": "#888"    };

export default function HoursPage() {
  const [fEmp, setFEmp] = useState("");
  const [fDay, setFDay] = useState("");

  const timeLog  = useMemo(() => generateTimeLog(), []);
  const filtered = timeLog.filter((l) => (!fEmp || l.emp === fEmp) && (!fDay || l.day === fDay));

  const onlineEmps = EMP_STATUS.filter((e) => e.status === "Online");
  const avgToday   = onlineEmps.length
    ? (onlineEmps.reduce((a, e) => a + e.netHours, 0) / onlineEmps.length).toFixed(1)
    : "0.0";

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <MetricCard label="Online Now"       value={EMP_STATUS.filter((e) => e.status === "Online").length}      color="#3B6D11" />
        <MetricCard label="On Break"         value={EMP_STATUS.filter((e) => e.status === "On Break").length}    color="#BA7517" />
        <MetricCard label="Logged Out"       value={EMP_STATUS.filter((e) => e.status === "Logged Out").length}  color="#888"    />
        <MetricCard label="Avg Hours Today"  value={`${avgToday}h`}                                              color="#378ADD" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>

        {/* Attendance */}
        <Card>
          <SectionTitle>Today's Attendance</SectionTitle>
          {EMP_STATUS.map((e) => (
            <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f5f5f3" }}>
              <Avatar emp={e} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{e.name}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{e.role}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ background: STATUS_BG[e.status], color: STATUS_TC[e.status], padding: "3px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                  {e.status}
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{ background: "#f5f5f3", color: "#555", padding: "2px 7px", borderRadius: 6, fontSize: 11 }}>In: {e.login}</span>
                  {e.netHours > 0 && <span style={{ background: "#f5f5f3", color: "#555", padding: "2px 7px", borderRadius: 6, fontSize: 11 }}>{e.netHours}h</span>}
                </div>
              </div>
            </div>
          ))}
        </Card>

        {/* Weekly bar chart */}
        <Card>
          <SectionTitle>Weekly Average Hours</SectionTitle>
          {EMPLOYEES.map((e) => {
            const logs = timeLog.filter((l) => l.emp === e.name);
            const avg  = logs.length ? parseFloat((logs.reduce((a, l) => a + l.net, 0) / logs.length).toFixed(1)) : 0;
            const pct  = Math.min(100, (avg / 10) * 100);
            const bar  = avg >= 8 ? "#639922" : avg >= 6 ? "#BA7517" : "#E24B4A";
            return (
              <div key={e.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                <div style={{ width: 90, fontSize: 12, color: "#444", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.name.split(" ")[0]}
                </div>
                <div style={{ flex: 1, height: 10, background: "#f0f0ee", borderRadius: 5, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: bar, width: `${pct}%`, borderRadius: 5, transition: "width .4s" }} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: bar, width: 36, textAlign: "right" }}>{avg}h</div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Detailed log */}
      <Card>
        <SectionTitle>Detailed Time Log</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <SelectFilter value={fEmp} onChange={setFEmp} placeholder="All Employees" options={EMPLOYEES.map((e) => e.name)} />
          <SelectFilter value={fDay} onChange={setFDay} placeholder="All Days"      options={DAYS} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><TH>Employee</TH><TH>Day</TH><TH>Login</TH><TH>Logout</TH><TH>Break</TH><TH>Net Hours</TH><TH>Status</TH></tr>
            </thead>
            <tbody>
              {filtered.map((l, i) => (
                <tr key={i}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <TD><span style={{ fontWeight: 700, color: "#111" }}>{l.emp}</span></TD>
                  <TD><span style={{ background: "#f5f5f3", padding: "2px 9px", borderRadius: 6, fontSize: 12, color: "#444", fontWeight: 700 }}>{l.day}</span></TD>
                  <TD style={{ fontSize: 12, color: "#555" }}>{l.login}</TD>
                  <TD style={{ fontSize: 12, color: "#555" }}>{l.logout}</TD>
                  <TD style={{ fontSize: 12, color: "#888" }}>{l.breaks ? `${l.breaks} min` : "—"}</TD>
                  <TD><span style={{ fontWeight: 800, fontSize: 14, color: l.net >= 8 ? "#3B6D11" : l.net >= 6 ? "#BA7517" : "#A32D2D" }}>{l.net}h</span></TD>
                  <TD><Badge label={l.net >= 8 ? "Full Day" : "Short"} bg={l.net >= 8 ? "#EAF3DE" : "#FAEEDA"} tc={l.net >= 8 ? "#3B6D11" : "#854F0B"} small /></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}