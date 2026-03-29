export const COLORS = {
  blue: "#378ADD", green: "#3B6D11", amber: "#BA7517", red: "#A32D2D",
  purple: "#534AB7", teal: "#1D9E75", gray: "#5F5E5A",
};

export const EMPLOYEES = [
  { name: "Priya Sharma",   role: "Senior Accountant", av: "PS", color: "#E6F1FB", tc: "#185FA5" },
  { name: "Ravi Kumar",     role: "Accountant",         av: "RK", color: "#EAF3DE", tc: "#3B6D11" },
  { name: "Deepa Nair",     role: "Tax Analyst",        av: "DN", color: "#FBEAF0", tc: "#993556" },
  { name: "Suresh Babu",    role: "Audit Staff",        av: "SB", color: "#FAEEDA", tc: "#854F0B" },
  { name: "Anita Rao",      role: "Payroll Exec",       av: "AR", color: "#EEEDFE", tc: "#534AB7" },
  { name: "Kiran Reddy",    role: "Tax Analyst",        av: "KR", color: "#E1F5EE", tc: "#0F6E56" },
  { name: "Meera Pillai",   role: "Accountant",         av: "MP", color: "#FAECE7", tc: "#993C1D" },
  { name: "Arjun Patel",    role: "Audit Staff",        av: "AP", color: "#F1EFE8", tc: "#5F5E5A" },
  { name: "Sunita Verma",   role: "Senior Accountant",  av: "SV", color: "#E6F1FB", tc: "#185FA5" },
  { name: "Vijay Mehta",    role: "Advisory Exec",      av: "VM", color: "#EAF3DE", tc: "#3B6D11" },
];

export const CATEGORIES = [
  "GST Filing", "Audit", "Payroll", "Tax Compliance",
  "Advisory", "Reconciliation", "Other",
];

export const CAT_COLORS = {
  "GST Filing":      { bg: "#E6F1FB", tc: "#185FA5" },
  "Audit":           { bg: "#EAF3DE", tc: "#3B6D11" },
  "Payroll":         { bg: "#EEEDFE", tc: "#534AB7" },
  "Tax Compliance":  { bg: "#FAEEDA", tc: "#854F0B" },
  "Advisory":        { bg: "#E1F5EE", tc: "#0F6E56" },
  "Reconciliation":  { bg: "#FAECE7", tc: "#993C1D" },
  "Other":           { bg: "#F1EFE8", tc: "#5F5E5A" },
};

export const STATUS_STYLES = {
  "Open":          { bg: "#E6F1FB", tc: "#185FA5" },
  "In Progress":   { bg: "#FAEEDA", tc: "#854F0B" },
  "Under Review":  { bg: "#EEEDFE", tc: "#534AB7" },
  "Done":          { bg: "#EAF3DE", tc: "#3B6D11" },
};

export const PRIORITY_COLOR = { Critical: "#A32D2D", High: "#BA7517", Normal: "#5F5E5A" };

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export function offsetDate(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() + d);
  return dt.toISOString().split("T")[0];
}

export const TODAY = offsetDate(0);
export const isOverdue = (t) => t.deadline < TODAY && t.status !== "Done";
export const daysLeft  = (d) => Math.ceil((new Date(d) - new Date(TODAY)) / 86400000);

let _id = 13;
export const nextId = () => `TK-${String(_id++).padStart(3, "0")}`;

export const SEED_TICKETS = [
  { subject: "Q3 GST Return Filing",     cat: "GST Filing",     client: "Reddy Textiles",         status: "In Progress",  assign: "Priya Sharma",  deadline: offsetDate(-2), priority: "Critical", escalated: true  },
  { subject: "Statutory Audit FY24",     cat: "Audit",          client: "Bharat Exports",          status: "Open",         assign: "Ravi Kumar",    deadline: offsetDate(3),  priority: "High",     escalated: false },
  { subject: "Payroll Processing Mar",   cat: "Payroll",        client: "Internal",                status: "Under Review", assign: "Anita Rao",     deadline: offsetDate(1),  priority: "Normal",   escalated: false },
  { subject: "Income Tax Advisory",      cat: "Advisory",       client: "Srinivas & Co.",          status: "Open",         assign: "Vijay Mehta",   deadline: offsetDate(-1), priority: "High",     escalated: false },
  { subject: "TDS Compliance Check",     cat: "Tax Compliance", client: "Vishnu Pharma",           status: "Open",         assign: "Deepa Nair",    deadline: offsetDate(5),  priority: "Normal",   escalated: false },
  { subject: "Year-End Reconciliation",  cat: "Reconciliation", client: "Lakshmi Mills",           status: "Done",         assign: "Suresh Babu",   deadline: offsetDate(-5), priority: "Normal",   escalated: false },
  { subject: "GST Audit Support",        cat: "GST Filing",     client: "Krishna Traders",         status: "In Progress",  assign: "Kiran Reddy",   deadline: offsetDate(0),  priority: "High",     escalated: true  },
  { subject: "Employee Benefits Review", cat: "Advisory",       client: "Internal",                status: "Open",         assign: "Meera Pillai",  deadline: offsetDate(7),  priority: "Normal",   escalated: false },
  { subject: "Vendor Payment Audit",     cat: "Audit",          client: "Saraswati Constructions", status: "Open",         assign: "Arjun Patel",   deadline: offsetDate(-3), priority: "High",     escalated: false },
  { subject: "Form 16 Issuance",         cat: "Tax Compliance", client: "Internal",                status: "Done",         assign: "Sunita Verma",  deadline: offsetDate(-10),priority: "Normal",   escalated: false },
  { subject: "Bank Reconciliation Q4",   cat: "Reconciliation", client: "Nanda Steels",            status: "Open",         assign: "Priya Sharma",  deadline: offsetDate(2),  priority: "High",     escalated: false },
  { subject: "GST Input Credit Claim",   cat: "GST Filing",     client: "Apex Traders",            status: "Open",         assign: "Deepa Nair",    deadline: offsetDate(-4), priority: "Critical", escalated: true  },
].map((t, i) => ({
  id: `TK-${String(i + 1).padStart(3, "0")}`,
  created: offsetDate(-Math.floor(i % 5)),
  ...t,
}));

export const EMP_STATUS = EMPLOYEES.map((e, i) => ({
  ...e,
  status:   i < 6 ? "Online" : i < 8 ? "On Break" : "Logged Out",
  login:    i < 9 ? `09:${String(15 + i * 3).padStart(2, "0")}` : "--",
  netHours: i < 9 ? parseFloat((6 + Math.random() * 2).toFixed(1)) : 0,
}));

export function generateTimeLog() {
  return EMPLOYEES.flatMap((e) =>
    DAYS.map((d) => {
      const lh  = 8 + Math.floor(Math.random() * 2);
      const lm  = Math.floor(Math.random() * 30);
      const net = parseFloat((6 + Math.random() * 2).toFixed(1));
      return {
        emp:    e.name,
        day:    d,
        login:  `${lh}:${String(lm).padStart(2, "0")}`,
        logout: `${lh + Math.round(net)}:${String(lm).padStart(2, "0")}`,
        breaks: [0, 15, 30][Math.floor(Math.random() * 3)],
        net,
      };
    })
  );
}