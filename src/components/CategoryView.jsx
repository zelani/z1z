// CategoryView.jsx
import { CAT_COLORS, STATUS_STYLES, PRIORITY_COLOR, COLORS, isOverdue } from "../data";
import { Card, SectionTitle, MetricCard, StatusBadge, Badge, DLChip, TH, TD, Btn } from "./ui";

export default function CategoryView({ cat, tickets, onBack, onTicketClick }) {
  const catTickets = tickets.filter((t) => t.cat === cat);
  const c = CAT_COLORS[cat] || CAT_COLORS["Other"];

  return (
    <div>
      <Btn onClick={onBack} style={{ marginBottom: 18 }}>← Back to All Tickets</Btn>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <span style={{ background: c.bg, color: c.tc, padding: "8px 22px", borderRadius: 24, fontSize: 16, fontWeight: 800 }}>
          {cat}
        </span>
        <span style={{ fontSize: 13, color: "#888" }}>{catTickets.length} ticket(s) in this category</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        {["Open", "In Progress", "Under Review", "Done"].map((s) => (
          <MetricCard key={s} label={s} value={catTickets.filter((t) => t.status === s).length} color={STATUS_STYLES[s].tc} />
        ))}
        <MetricCard label="Overdue"   value={catTickets.filter(isOverdue).length}           color="#A32D2D" />
        <MetricCard label="Escalated" value={catTickets.filter((t) => t.escalated).length}  color="#534AB7" />
      </div>

      <Card>
        <SectionTitle>All tickets — {cat}</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><TH>ID</TH><TH>Subject</TH><TH>Client</TH><TH>Assigned</TH><TH>Status</TH><TH>Deadline</TH><TH>Priority</TH><TH>Flags</TH></tr>
            </thead>
            <tbody>
              {catTickets.map((t) => (
                <tr key={t.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  style={{ cursor: "pointer" }}
                  onClick={() => onTicketClick(t)}
                >
                  <TD><span style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>{t.id}</span></TD>
                  <TD><span style={{ color: COLORS.blue, fontWeight: 700 }}>{t.subject}</span></TD>
                  <TD>{t.client}</TD>
                  <TD>{t.assign}</TD>
                  <TD><StatusBadge status={t.status} /></TD>
                  <TD><div style={{ fontSize: 12 }}>{t.deadline}</div><DLChip deadline={t.deadline} /></TD>
                  <TD><span style={{ color: PRIORITY_COLOR[t.priority], fontWeight: 700, fontSize: 12 }}>{t.priority}</span></TD>
                  <TD>
                    {isOverdue(t)  && <Badge label="Overdue"   bg="#FCEBEB" tc="#A32D2D" small />}
                    {t.escalated   && <Badge label="Escalated" bg="#FAECE7" tc="#993C1D" small />}
                  </TD>
                </tr>
              ))}
              {catTickets.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>No tickets in this category yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}