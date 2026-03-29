// ChatPanel.jsx
import { useState, useRef, useEffect } from "react";
import { isOverdue, COLORS, TODAY } from "../data";

export default function ChatPanel({ tickets, empStatus }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { who: "bot", text: "Hi! I'm your TeamTrack assistant. Ask about tickets, deadlines, or staff." },
  ]);
  const [inp, setInp] = useState("");
  const endRef = useRef();

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const bot = (q) => {
    const ql = q.toLowerCase();
    if (ql.includes("overdue"))   return `${tickets.filter(isOverdue).length} overdue ticket(s). Check the Escalated view.`;
    if (ql.includes("escalat"))   return `${tickets.filter((t) => t.escalated).length} ticket(s) are escalated.`;
    if (ql.includes("open"))      return `${tickets.filter((t) => t.status !== "Done").length} ticket(s) are open or in progress.`;
    if (ql.includes("online"))    return `${empStatus.filter((e) => e.status === "Online").length} employees are online right now.`;
    if (ql.includes("done") || ql.includes("complet")) return `${tickets.filter((t) => t.status === "Done").length} ticket(s) completed.`;
    if (ql.includes("break"))     return `${empStatus.filter((e) => e.status === "On Break").length} employees are on break.`;
    if (ql.includes("critical"))  return `${tickets.filter((t) => t.priority === "Critical" && t.status !== "Done").length} critical ticket(s) open.`;
    if (ql.includes("today"))     return `${tickets.filter((t) => t.deadline === TODAY).length} ticket(s) due today.`;
    return "Try: 'how many overdue?', 'who is online?', 'any critical tickets?'";
  };

  const send = () => {
    if (!inp.trim()) return;
    const m = inp.trim();
    setInp("");
    setMsgs((p) => [...p, { who: "user", text: m }]);
    setTimeout(() => setMsgs((p) => [...p, { who: "bot", text: bot(m) }]), 350);
  };

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} title="Assistant" style={{
        position: "fixed", bottom: 24, right: 24,
        width: 52, height: 52, borderRadius: "50%",
        background: COLORS.blue, color: "#fff",
        border: "none", fontSize: 22, cursor: "pointer",
        zIndex: 500, boxShadow: "0 4px 16px rgba(55,138,221,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>✍</button>

      {open && (
        <div style={{
          position: "fixed", bottom: 86, right: 24, width: 330,
          background: "#fff", border: "1px solid #e0e0dc",
          borderRadius: 16, zIndex: 500, display: "flex", flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B6D11" }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: "#222" }}>TeamTrack Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#bbb", fontSize: 18 }}>✕</button>
          </div>

          <div style={{ padding: "12px 14px", overflowY: "auto", maxHeight: 280, display: "flex", flexDirection: "column", gap: 8 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.who === "user" ? "flex-end" : "flex-start",
                background: m.who === "user" ? COLORS.blue : "#f3f3f0",
                color: m.who === "user" ? "#fff" : "#222",
                padding: "9px 13px", borderRadius: 12, fontSize: 13,
                maxWidth: "85%", lineHeight: 1.5,
                borderBottomRightRadius: m.who === "user" ? 3 : 12,
                borderBottomLeftRadius:  m.who === "bot"  ? 3 : 12,
              }}>{m.text}</div>
            ))}
            <div ref={endRef} />
          </div>

          <div style={{ padding: "6px 14px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid #f5f5f5" }}>
            {["How many overdue?", "Who is online?", "Critical tickets?"].map((q) => (
              <button key={q} onClick={() => { setInp(q); setTimeout(send, 50); }} style={{
                padding: "4px 10px", border: "1px solid #ddd", borderRadius: 20,
                fontSize: 11, cursor: "pointer", color: COLORS.blue,
                background: "#E6F1FB", fontWeight: 600,
              }}>{q}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid #eee" }}>
            <input value={inp} onChange={(e) => setInp(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything…"
              style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 20, fontSize: 13, color: "#222" }}
            />
            <button onClick={send} style={{
              background: COLORS.blue, color: "#fff", border: "none",
              borderRadius: "50%", width: 34, height: 34, fontSize: 16,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>→</button>
          </div>
        </div>
      )}
    </>
  );
}