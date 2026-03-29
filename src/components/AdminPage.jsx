// AdminPage.jsx
import { useState } from "react";
import { EMPLOYEES, CATEGORIES, CAT_COLORS, COLORS, isOverdue, TODAY, nextId, PRIORITY_COLOR } from "../data";
import { Card, SectionTitle, MetricCard, AlertBanner, StatusBadge, CatBadge, Badge, DLChip, TH, TD, Btn, SelectFilter, FormField, inputStyle } from "./ui";
import TicketModal  from "./TicketModal";
import CategoryView from "./CategoryView";

const defaultForm = {
  subject: "", cat: "GST Filing", client: "", status: "Open",
  assign: "Priya Sharma", deadline: "", priority: "Normal", escalated: false,
};

export default function AdminPage({ tickets, setTickets }) {
  const [modal,   setModal]   = useState(null);
  const [catView, setCatView] = useState(null);
  const [fStatus, setFStatus] = useState("");
  const [fAssign, setFAssign] = useState("");
  const [fCat,    setFCat]    = useState("");
  const [fSearch, setFSearch] = useState("");
  const [form,    setForm]    = useState(defaultForm);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const createTicket = () => {
    if (!form.subject.trim()) { alert("Please enter a subject."); return; }
    const deadline = form.deadline || (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split("T")[0]; })();
    setTickets((p) => [{ id: nextId(), created: TODAY, ...form, deadline }, ...p]);
    setForm((f) => ({ ...f, subject: "", client: "", deadline: "" }));
  };

  const updateStatus = (id, status) =>
    setTickets((p) => p.map((t) => (t.id === id ? { ...t, status } : t)));

  const exportCSV = () => {
    const rows = [
      ["ID", "Subject", "Category", "Client", "Assigned", "Status", "Deadline", "Priority", "Escalated"],
      ...tickets.map((t) => [t.id, t.subject, t.cat, t.client, t.assign, t.status, t.deadline, t.priority, t.escalated]),
    ];
    const a = document.createElement("a");
    a.href = "data:text/csv," + encodeURIComponent(rows.map((r) => r.join(",")).join("\n"));
    a.download = "tickets.csv";
    a.click();
  };

  const filtered = tickets.filter((t) => {
    if (fStatus && t.status !== fStatus) return false;
    if (fAssign && t.assign !== fAssign) return false;
    if (fCat    && t.cat    !== fCat)    return false;
    if (fSearch &&
      !t.subject.toLowerCase().includes(fSearch.toLowerCase()) &&
      !t.client.toLowerCase().includes(fSearch.toLowerCase())) return false;
    return true;
  });

  const overdue = tickets.filter(isOverdue);
  const esc     = tickets.filter((t) => t.escalated && t.status !== "Done");

  if (catView) return (
    <CategoryView cat={catView} tickets={tickets} onBack={() => setCatView(null)} onTicketClick={setModal} />
  );

  return (
    <div>
      {modal && <TicketModal ticket={modal} onClose={() => setModal(null)} onUpdate={updateStatus} />}

      {overdue.length > 0 && (
        <AlertBanner type="danger">🔴 <strong>{overdue.length} overdue ticket(s)</strong> — supervisor notified: {overdue.map((t) => t.id).join(", ")}</AlertBanner>
      )}
      {esc.length > 0 && (
        <AlertBanner type="warn">🚨 <strong>{esc.length} escalated ticket(s)</strong>: {esc.map((t) => t.id).join(", ")}</AlertBanner>
      )}

      {/* Metrics */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 22 }}>
        <MetricCard label="Total Tickets"  value={tickets.length}                                 color="#378ADD" />
        <MetricCard label="Open"           value={tickets.filter((t) => t.status !== "Done").length} color="#BA7517" />
        <MetricCard label="Overdue"        value={overdue.length}                                 color="#A32D2D" />
        <MetricCard label="Escalated"      value={tickets.filter((t) => t.escalated).length}      color="#534AB7" />
        <MetricCard label="Completed"      value={tickets.filter((t) => t.status === "Done").length} color="#3B6D11" />
      </div>

      {/* Category links */}
      <Card style={{ marginBottom: 18 }}>
        <SectionTitle>Browse by Category</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {CATEGORIES.map((cat) => {
            const c     = CAT_COLORS[cat];
            const count = tickets.filter((t) => t.cat === cat).length;
            const ov    = tickets.filter((t) => t.cat === cat && isOverdue(t)).length;
            return (
              <button key={cat} onClick={() => setCatView(cat)} style={{
                background: c.bg, color: c.tc, border: `1.5px solid ${c.tc}30`,
                borderRadius: 10, padding: "9px 18px", fontSize: 13,
                fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              }}>
                {cat}
                <span style={{ background: c.tc, color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{count}</span>
                {ov > 0 && <span style={{ background: "#FCEBEB", color: "#A32D2D", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{ov} overdue</span>}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Create Ticket */}
      <Card style={{ marginBottom: 18 }}>
        <SectionTitle>Create New Ticket</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Subject *">
              <input value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Ticket subject line…" style={inputStyle} />
            </FormField>
          </div>
          <FormField label="Category">
            <select value={form.cat} onChange={(e) => set("cat", e.target.value)} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Client Name">
            <input value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Client name…" style={inputStyle} />
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => set("status", e.target.value)} style={inputStyle}>
              {["Open", "In Progress", "Under Review", "Done"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Assigned To">
            <select value={form.assign} onChange={(e) => set("assign", e.target.value)} style={inputStyle}>
              {EMPLOYEES.map((e) => <option key={e.name}>{e.name}</option>)}
            </select>
          </FormField>
          <FormField label="Deadline">
            <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} style={inputStyle} />
          </FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => set("priority", e.target.value)} style={inputStyle}>
              {["Normal", "High", "Critical"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 20 }}>
            <input type="checkbox" id="esc" checked={form.escalated} onChange={(e) => set("escalated", e.target.checked)} style={{ width: 17, height: 17 }} />
            <label htmlFor="esc" style={{ fontSize: 13, color: "#993C1D", fontWeight: 700, cursor: "pointer" }}>Mark as Escalated</label>
          </div>
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <Btn variant="primary" onClick={createTicket}>Create Ticket</Btn>
          <Btn onClick={() => setForm(defaultForm)}>Clear</Btn>
        </div>
      </Card>

      {/* Ticket Table */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <SectionTitle>All Tickets ({filtered.length})</SectionTitle>
          <Btn onClick={exportCSV} style={{ fontSize: 12, padding: "6px 14px" }}>Export CSV</Btn>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <SelectFilter value={fStatus} onChange={setFStatus} placeholder="All Status"     options={["Open", "In Progress", "Under Review", "Done"]} />
          <SelectFilter value={fAssign} onChange={setFAssign} placeholder="All Staff"      options={EMPLOYEES.map((e) => e.name)} />
          <SelectFilter value={fCat}    onChange={setFCat}    placeholder="All Categories" options={CATEGORIES} />
          <input value={fSearch} onChange={(e) => setFSearch(e.target.value)} placeholder="Search subject / client…"
            style={{ padding: "7px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, color: "#222", minWidth: 190 }} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr><TH>ID</TH><TH>Subject</TH><TH>Category</TH><TH>Client</TH><TH>Assigned</TH><TH>Status</TH><TH>Deadline</TH><TH>Flags</TH><TH>Update</TH></tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf8")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <TD><span style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>{t.id}</span></TD>
                  <TD><span onClick={() => setModal(t)} style={{ color: COLORS.blue, fontWeight: 700, cursor: "pointer" }}>{t.subject}</span></TD>
                  <TD><CatBadge cat={t.cat} onClick={() => setCatView(t.cat)} /></TD>
                  <TD style={{ fontSize: 12 }}>{t.client}</TD>
                  <TD style={{ fontSize: 12 }}>{t.assign}</TD>
                  <TD><StatusBadge status={t.status} /></TD>
                  <TD><div style={{ fontSize: 12 }}>{t.deadline}</div><DLChip deadline={t.deadline} /></TD>
                  <TD>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {isOverdue(t)           && <Badge label="Overdue"   bg="#FCEBEB" tc="#A32D2D" small />}
                      {t.escalated            && <Badge label="Escalated" bg="#FAECE7" tc="#993C1D" small />}
                      {t.priority==="Critical" && <Badge label="Critical" bg="#FCEBEB" tc="#A32D2D" small />}
                    </div>
                  </TD>
                  <TD>
                    <select defaultValue={t.status}
                      onChange={(e) => setTickets((p) => p.map((x) => x.id === t.id ? { ...x, status: e.target.value } : x))}
                      style={{ padding: "5px 8px", border: "1px solid #ddd", borderRadius: 7, fontSize: 12, color: "#222" }}>
                      {["Open", "In Progress", "Under Review", "Done"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </TD>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 13 }}>No tickets match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}