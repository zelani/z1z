// TicketModal.jsx
import { useState } from "react";
import { isOverdue, PRIORITY_COLOR } from "../data";
import { CatBadge, StatusBadge, Badge, DLChip, Btn } from "./ui";

export default function TicketModal({ ticket, onClose, onUpdate }) {
  const [status, setStatus] = useState(ticket.status);
  const ov = isOverdue(ticket);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center",
      justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, width: "100%",
        maxWidth: 540, maxHeight: "90vh", overflowY: "auto",
        padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>
              {ticket.id} · created {ticket.created}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111" }}>{ticket.subject}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#bbb" }}>✕</button>
        </div>

        {/* Details */}
        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", rowGap: 12, fontSize: 13, marginBottom: 22 }}>
          {[
            ["Category",    <CatBadge cat={ticket.cat} />],
            ["Client",      ticket.client],
            ["Assigned to", ticket.assign],
            ["Status",      <StatusBadge status={ticket.status} />],
            ["Deadline",    <span>{ticket.deadline} <DLChip deadline={ticket.deadline} /></span>],
            ["Priority",    <span style={{ color: PRIORITY_COLOR[ticket.priority], fontWeight: 700 }}>{ticket.priority}</span>],
            ["Escalated",   ticket.escalated
              ? <Badge label="Yes – escalated" bg="#FAECE7" tc="#993C1D" />
              : <span style={{ color: "#aaa" }}>No</span>],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: "contents" }}>
              <span style={{ color: "#888", fontWeight: 600, paddingTop: 2 }}>{k}</span>
              <span>{v}</span>
            </div>
          ))}
          {ov && (
            <div style={{ display: "contents" }}>
              <span />
              <Badge label="⚠ Overdue – supervisor alerted" bg="#FCEBEB" tc="#A32D2D" />
            </div>
          )}
        </div>

        {/* Update bar */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", borderTop: "1px solid #f0f0ee", paddingTop: 16, flexWrap: "wrap" }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "8px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, color: "#222" }}>
            {["Open", "In Progress", "Under Review", "Done"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <Btn variant="primary" onClick={() => { onUpdate(ticket.id, status); onClose(); }}>Update Status</Btn>
          <Btn onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}