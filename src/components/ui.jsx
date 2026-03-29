// ui.jsx
import { CAT_COLORS, STATUS_STYLES, COLORS, daysLeft } from "../data";

export const Badge = ({ label, bg, tc, small }) => (
  <span style={{
    background: bg, color: tc,
    padding: small ? "2px 8px" : "3px 11px",
    borderRadius: 20, fontSize: small ? 11 : 12,
    fontWeight: 600, whiteSpace: "nowrap", display: "inline-block",
  }}>{label}</span>
);

export const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Open"];
  return <Badge label={status} bg={s.bg} tc={s.tc} />;
};

export const CatBadge = ({ cat, onClick }) => {
  const c = CAT_COLORS[cat] || CAT_COLORS["Other"];
  return (
    <span onClick={onClick} style={{
      background: c.bg, color: c.tc,
      padding: "3px 11px", borderRadius: 20,
      fontSize: 12, fontWeight: 600,
      cursor: onClick ? "pointer" : "default",
      textDecoration: onClick ? "underline dotted" : "none",
      whiteSpace: "nowrap", display: "inline-block",
    }}>{cat}</span>
  );
};

export const Avatar = ({ emp }) => (
  <div style={{
    width: 36, height: 36, borderRadius: "50%",
    background: emp.color, color: emp.tc,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  }}>{emp.av}</div>
);

export const MetricCard = ({ label, value, color, sub }) => (
  <div style={{
    background: "#fff", border: "1px solid #e8e8e5",
    borderRadius: 12, padding: "14px 18px", minWidth: 120, flex: "1 1 120px",
  }}>
    <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 800, color: color || "#222" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{sub}</div>}
  </div>
);

export const Card = ({ children, style }) => (
  <div style={{
    background: "#fff", border: "1px solid #e8e8e5",
    borderRadius: 14, padding: "18px 22px", ...style,
  }}>{children}</div>
);

export const SectionTitle = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 14 }}>{children}</div>
);

export const AlertBanner = ({ type, children }) => {
  const s = type === "danger"
    ? { bg: "#FCEBEB", border: "#F09595", tc: "#A32D2D" }
    : { bg: "#FAEEDA", border: "#FAC775", tc: "#854F0B" };
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 10, padding: "10px 14px", marginBottom: 10,
      fontSize: 13, color: s.tc, display: "flex", alignItems: "center", gap: 8,
    }}>{children}</div>
  );
};

export const DLChip = ({ deadline }) => {
  const dl = daysLeft(deadline);
  if (dl < 0)  return <span style={{ fontSize: 11, color: "#A32D2D", fontWeight: 700 }}>{Math.abs(dl)}d overdue</span>;
  if (dl === 0) return <span style={{ fontSize: 11, color: "#BA7517", fontWeight: 700 }}>Due today</span>;
  return <span style={{ fontSize: 11, color: "#5F5E5A" }}>{dl}d left</span>;
};

export const TH = ({ children, style }) => (
  <th style={{
    textAlign: "left", padding: "9px 12px", fontSize: 12,
    color: "#666", fontWeight: 700, borderBottom: "1.5px solid #eee",
    whiteSpace: "nowrap", background: "#fafaf8", ...style,
  }}>{children}</th>
);

export const TD = ({ children, style }) => (
  <td style={{
    padding: "10px 12px", fontSize: 13, color: "#222",
    borderBottom: "1px solid #f5f5f3", verticalAlign: "middle", ...style,
  }}>{children}</td>
);

export const Btn = ({ children, onClick, variant = "default", disabled, style }) => {
  const v = {
    primary: { background: COLORS.blue,  color: "#fff",    border: "none" },
    danger:  { background: "#FCEBEB",     color: "#A32D2D", border: "1px solid #F09595" },
    default: { background: "#f5f5f3",     color: "#444",    border: "1px solid #ddd" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...v[variant], borderRadius: 8, padding: "8px 18px",
      fontSize: 13, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.45 : 1, transition: "opacity .15s", ...style,
    }}>{children}</button>
  );
};

export const SelectFilter = ({ value, onChange, options, placeholder }) => (
  <select value={value} onChange={(e) => onChange(e.target.value)} style={{
    padding: "7px 10px", border: "1px solid #ddd",
    borderRadius: 8, fontSize: 13, color: "#222", background: "#fff",
  }}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) =>
      typeof o === "string"
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>
    )}
  </select>
);

export const FormField = ({ label, children }) => (
  <div>
    <label style={{ display: "block", fontSize: 12, color: "#666", fontWeight: 700, marginBottom: 5 }}>{label}</label>
    {children}
  </div>
);

export const inputStyle = {
  width: "100%", padding: "8px 11px", border: "1px solid #ddd",
  borderRadius: 8, fontSize: 13, color: "#222", background: "#fff",
};