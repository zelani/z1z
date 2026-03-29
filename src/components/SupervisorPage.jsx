// SupervisorPage.jsx
import { useState } from "react";
import { EMPLOYEES, COLORS, isOverdue, daysLeft, TODAY, PRIORITY_COLOR } from "../data";
import { Card, SectionTitle, MetricCard, AlertBanner, StatusBadge, Badge, DLChip, Avatar, TH, TD, Btn, SelectFilter } from "./ui";
import TicketModal from "./TicketModal";

const VIEWS = [
  { id: "outstanding", label: "Outstanding" },
  { id: "bystaff",     label: "By Staff"     },
  { id: "timeline",    label: "Timeline"     },
  { id: "escalated",   label: "Escalated"    },
];

export default function SupervisorPage({ tickets, setTickets }) {
  const [view,    setView]    = useState("outstanding");
  const [modal,   setModal]   = useState(null);
  const [fAssign, setFAssign] = useState("");
  const [fDl,     setFDl]     = useState("");
  const [fPri,    setFPri]    = useState("");

  const updateStatus = (id, status) =>
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, status } : t)));

  const reassign = (id) => {
    const names  = EMPLOYEES.map((e) => e.name);
    const choice = window.prompt(`Reassign to:\n${names.map((n, i) => `${i + 1}. ${n}`).join("\n")}\n\nEnter number:`);
    const idx    = parseInt(choice) - 1;
    if (idx >= 0 && idx < names.length)
      setTickets((p) => p.map((t) => (t.id === id ? { ...t, assign: names[idx] } : t)));
  };

  const open       = tickets.filter((t) => t.status !== "Done");
  const escOverdue = tickets.filter((t) => t.escalated || isOverdue(t));

  const filtered = open.filter((t) => {
    if (fAssign && t.assign !== fAssign) return false;
    if (fPri    && t.priority !== fPri)  return false;
    const dl = daysLeft(t.deadline);
    if (fDl === "today"   && t.deadline !== TODAY) return false;
    if (fDl === "overdue" && !isOverdue(t))         return false;
    if (fDl === "week"    && (dl < 0 || dl > 7))    return false;
    return true;
  });

  return (
    <div>
      {modal && <TicketModal ticket={modal} onClose={() => setModal(null)} onUpdate={updateStatus} />}

      {/* Tab bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 22, flexWrap: "wrap" }}>
        {VIEWS.map((v) => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 700, cursor: "pointer",
            border:     `1.5px solid ${view === v.id ? COLORS.blue : "#ddd"}`,
            background: view === v.id ? COLORS.blue : "#fff",
            color:      view === v.id ? "#fff" : "#555",
            position: "relative",
          }}>
            {v.label}
            {v.id === "escalated" && escOverdue.length > 0 && (
              <span style={{ position: "absolute", top: 5, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#E24B4A" }} />
            )}
          </button>
        ))}
      </div>

      {/* ─── OUTSTANDING ─── */}
      {view === "outstanding" && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <MetricCard label="Total Open"    value={open.length}                                    color="#378ADD" />
            <MetricCard label="Due Today"     value={open.filter((t) => t.deadline === TODAY).length} color="#BA7517" />
            <MetricCard label="Past Deadline" value={open.filter(isOverdue).length}                   color="#A32D2D" />
            <MetricCard label="Escalated"     value={tickets.filter((t) => t.escalated).length}       color="#534AB7" />
          </div>
          <Card>
            <SectionTitle>Outstanding Requests ({filtered.length})</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <SelectFilter value={fAssign} onChange={setFAssign} placeholder="All Staff"     options={EMPLOYEES.map((e) => e.name)} />
              <SelectFilter value={fDl}     onChange={setFDl}     placeholder="All Deadlines" options={[{ value: "today", label: "Due Today" }, { value: "week", label: "This Week" }, { value: "overdue", label: "Overdue" }]} />
              <SelectFilter value={fPri}    onChange={setFPri}    placeholder="All Priority"  options={["Critical", "High", "Normal"]} />
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><TH>ID</TH><TH>Subject</TH><TH>Client</TH><TH>Assigned</TH><TH>Deadline</TH><TH>Priority</TH><TH>Status</TH><TH>Flags</TH></tr></thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <TD><span style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>{t.id}</span></TD>
                      <TD><span onClick={() => setModal(t)} style={{ color: COLORS.blue, fontWeight: 700, cursor: "pointer" }}>{t.subject}</span></TD>
                      <TD style={{ fontSize: 12 }}>{t.client}</TD>
                      <TD style={{ fontSize: 12 }}>{t.assign}</TD>
                      <TD><div style={{ fontSize: 12 }}>{t.deadline}</div><DLChip deadline={t.deadline} /></TD>
                      <TD><span style={{ color: PRIORITY_COLOR[t.priority], fontWeight: 700, fontSize: 13 }}>{t.priority}</span></TD>
                      <TD><StatusBadge status={t.status} /></TD>
                      <TD style={{ display: "flex", gap: 4 }}>
                        {isOverdue(t) && <Badge label="Overdue"   bg="#FCEBEB" tc="#A32D2D" small />}
                        {t.escalated  && <Badge label="Escalated" bg="#FAECE7" tc="#993C1D" small />}
                      </TD>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>No matching tickets.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ─── BY STAFF ─── */}
      {view === "bystaff" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
          {EMPLOYEES.map((e) => {
            const myT  = tickets.filter((t) => t.assign === e.name);
            const done = myT.filter((t) => t.status === "Done").length;
            const ov   = myT.filter(isOverdue).length;
            const pct  = myT.length ? Math.round((done / myT.length) * 100) : 0;
            const bar  = pct > 70 ? "#639922" : pct > 40 ? "#BA7517" : "#378ADD";
            return (
              <Card key={e.name} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar emp={e} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>{e.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{e.role}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12 }}>
                  <span style={{ color: "#BA7517", fontWeight: 700 }}>{myT.filter((t) => t.status !== "Done").length} open</span>
                  <span style={{ color: "#3B6D11", fontWeight: 700 }}>{done} done</span>
                  {ov > 0 && <span style={{ color: "#A32D2D", fontWeight: 700 }}>{ov} overdue</span>}
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>Completion</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: bar }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: "#f0f0ee", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: bar, borderRadius: 4, width: `${pct}%`, transition: "width .5s" }} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ─── TIMELINE ─── */}
      {view === "timeline" && (
        <Card>
          <SectionTitle>Ticket activity — last 7 days</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 8 }}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => {
              const created = [3, 5, 2, 4, 6, 1, 2][i];
              const closed  = [2, 3, 4, 3, 5, 1, 2][i];
              return (
                <div key={d} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8, fontWeight: 700 }}>{d}</div>
                  <div style={{ background: "#E6F1FB", borderRadius: 10, padding: "12px 6px", marginBottom: 8 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#185FA5" }}>{created}</div>
                    <div style={{ fontSize: 10, color: "#185FA5", fontWeight: 600 }}>created</div>
                  </div>
                  <div style={{ background: "#EAF3DE", borderRadius: 10, padding: "12px 6px" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#3B6D11" }}>{closed}</div>
                    <div style={{ fontSize: 10, color: "#3B6D11", fontWeight: 600 }}>closed</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ─── ESCALATED ─── */}
      {view === "escalated" && (
        <div>
          {escOverdue.length > 0 && (
            <AlertBanner type="danger">🚨 <strong>{escOverdue.length} item(s)</strong> require immediate attention. Supervisor notified.</AlertBanner>
          )}
          <Card>
            <SectionTitle>Escalated & Overdue Items</SectionTitle>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><TH>ID</TH><TH>Subject</TH><TH>Client</TH><TH>Assigned</TH><TH>Deadline</TH><TH>Reason</TH><TH>Action</TH></tr></thead>
                <tbody>
                  {escOverdue.map((t) => (
                    <tr key={t.id}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <TD><span style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>{t.id}</span></TD>
                      <TD><span onClick={() => setModal(t)} style={{ color: COLORS.blue, fontWeight: 700, cursor: "pointer" }}>{t.subject}</span></TD>
                      <TD style={{ fontSize: 12 }}>{t.client}</TD>
                      <TD style={{ fontSize: 12 }}>{t.assign}</TD>
                      <TD><div style={{ fontSize: 12 }}>{t.deadline}</div><DLChip deadline={t.deadline} /></TD>
                      <TD style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {t.escalated  && <Badge label="Escalated" bg="#FAECE7" tc="#993C1D" small />}
                        {isOverdue(t) && <Badge label="Overdue"   bg="#FCEBEB" tc="#A32D2D" small />}
                      </TD>
                      <TD><Btn onClick={() => reassign(t.id)} style={{ fontSize: 12, padding: "5px 12px" }}>Reassign</Btn></TD>
                    </tr>
                  ))}
                  {escOverdue.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>No escalated or overdue items.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}