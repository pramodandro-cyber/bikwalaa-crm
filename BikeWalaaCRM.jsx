import { useState, useEffect, useCallback } from "react";

// ── GOOGLE FONTS ──────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Instrument+Serif:ital@0;1&display=swap";
document.head.appendChild(fontLink);

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080a0f; color: #e2e8f0; font-family: 'DM Mono', monospace; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #0d0f17; }
  ::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 2px; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse2 { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes slideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
  @keyframes scaleIn { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }

  .fade-up { animation: fadeUp 0.35s ease both; }
  .slide-in { animation: slideIn 0.3s cubic-bezier(0.16,1,0.3,1) both; }
  .scale-in { animation: scaleIn 0.25s ease both; }

  input, select, textarea {
    background: #0d0f17;
    border: 1px solid #1e2535;
    color: #e2e8f0;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    border-radius: 8px;
    padding: 10px 14px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus, textarea:focus { border-color: #f97316; }
  input::placeholder, textarea::placeholder { color: #3d4a5e; }
  select option { background: #0d0f17; }
  button { cursor: pointer; font-family: 'DM Mono', monospace; }
`;
document.head.appendChild(style);

// ── SEED DATA ─────────────────────────────────────────────────────────────────
const FRANCHISES = [
  { id: "f1", name: "Andheri West", city: "Mumbai", owner: "Rajesh Patel" },
  { id: "f2", name: "Thane Central", city: "Mumbai", owner: "Meera Shah" },
  { id: "f3", name: "Vashi", city: "Navi Mumbai", owner: "Suresh Kumar" },
  { id: "f4", name: "Kharghar", city: "Navi Mumbai", owner: "Priya Joshi" },
];

const MASTER_BIKES = [
  { id: "b1", brand: "Honda", model: "Activa 6G", variant: "Standard", cc: 109, fuel: "Petrol", category: "Scooter", img: "🛵" },
  { id: "b2", brand: "TVS", model: "Jupiter 125", variant: "Classic", cc: 124, fuel: "Petrol", category: "Scooter", img: "🛵" },
  { id: "b3", brand: "Hero", model: "Splendor+", variant: "IBS", cc: 97, fuel: "Petrol", category: "Commuter", img: "🏍️" },
  { id: "b4", brand: "Bajaj", model: "Pulsar N150", variant: "Standard", cc: 149, fuel: "Petrol", category: "Sports", img: "🏍️" },
  { id: "b5", brand: "Honda", model: "CB Shine", variant: "Disc", cc: 124, fuel: "Petrol", category: "Commuter", img: "🏍️" },
  { id: "b6", brand: "TVS", model: "Apache RTR 160", variant: "4V", cc: 159, fuel: "Petrol", category: "Sports", img: "🏍️" },
  { id: "b7", brand: "Suzuki", model: "Access 125", variant: "CBS", cc: 124, fuel: "Petrol", category: "Scooter", img: "🛵" },
  { id: "b8", brand: "Hero", model: "Glamour", variant: "IBS", cc: 124, fuel: "Petrol", category: "Commuter", img: "🏍️" },
];

const initPricing = () => ({
  b1: { exShowroom: 72000, rto: 8200, insurance: 4800, margin: 3500, minFloor: 2000, offers: ["Diwali Cashback ₹3,000"] },
  b2: { exShowroom: 78000, rto: 8800, insurance: 5200, margin: 4000, minFloor: 2500, offers: [] },
  b3: { exShowroom: 68000, rto: 7500, insurance: 4200, margin: 3000, minFloor: 1800, offers: ["Zero Accessories Free"] },
  b4: { exShowroom: 98000, rto: 11200, insurance: 6800, margin: 5000, minFloor: 3000, offers: ["Festival ₹5,000 off"] },
  b5: { exShowroom: 75000, rto: 8500, insurance: 5000, margin: 3800, minFloor: 2200, offers: [] },
  b6: { exShowroom: 115000, rto: 13200, insurance: 8200, margin: 6000, minFloor: 4000, offers: [] },
  b7: { exShowroom: 81000, rto: 9200, insurance: 5400, margin: 4200, minFloor: 2800, offers: ["Free Helmet"] },
  b8: { exShowroom: 73000, rto: 8200, insurance: 4900, margin: 3600, minFloor: 2000, offers: [] },
});

const initInventory = () => [
  { id: "i1", bikeId: "b1", franchiseId: "f1", status: "available", color: "Pearl Black", chassis: "MH01AL123456", stock: 12 },
  { id: "i2", bikeId: "b1", franchiseId: "f2", status: "available", color: "Matte Blue", chassis: "MH01AL123457", stock: 8 },
  { id: "i3", bikeId: "b2", franchiseId: "f1", status: "available", color: "Silver", chassis: "MH01TV234567", stock: 5 },
  { id: "i4", bikeId: "b3", franchiseId: "f3", status: "available", color: "Red", chassis: "NM01HR345678", stock: 18 },
  { id: "i5", bikeId: "b4", franchiseId: "f1", status: "available", color: "Black Red", chassis: "MH01BJ456789", stock: 3 },
  { id: "i6", bikeId: "b4", franchiseId: "f4", status: "out_of_stock", color: "Blue", chassis: "NM01BJ456790", stock: 0 },
  { id: "i7", bikeId: "b6", franchiseId: "f2", status: "available", color: "Racing Red", chassis: "MH01TV567890", stock: 4 },
  { id: "i8", bikeId: "b7", franchiseId: "f3", status: "reserved", color: "Pearl White", chassis: "NM01SZ678901", stock: 2 },
  { id: "i9", bikeId: "b5", franchiseId: "f4", status: "available", color: "Athletic Blue", chassis: "NM01HN789012", stock: 7 },
  { id: "i10", bikeId: "b8", franchiseId: "f2", status: "available", color: "Vibrant Red", chassis: "MH01HR890123", stock: 9 },
];

const initLeads = () => [
  { id: "l1", name: "Rahul Sharma", phone: "9876543210", email: "rahul@gmail.com", bikeId: "b1", franchiseId: "f1", stage: "new", source: "website", score: 82, followUp: "2024-11-02", notes: [], createdAt: "2024-10-28", assignedTo: "Amit V." },
  { id: "l2", name: "Priya Mehta", phone: "9823456789", email: "priya@gmail.com", bikeId: "b4", franchiseId: "f1", stage: "interested", source: "meta_ads", score: 91, followUp: "2024-10-31", notes: ["Wants black color", "Needs finance"], createdAt: "2024-10-26", assignedTo: "Rohit S." },
  { id: "l3", name: "Arun Kumar", phone: "9711234567", email: "arun@gmail.com", bikeId: "b2", franchiseId: "f2", stage: "finance", source: "walk_in", score: 95, followUp: "2024-10-30", notes: ["HDFC loan applied", "Docs submitted"], createdAt: "2024-10-24", assignedTo: "Meera S." },
  { id: "l4", name: "Sneha Patil", phone: "9634567890", email: "sneha@gmail.com", bikeId: "b3", franchiseId: "f3", stage: "booked", source: "whatsapp", score: 98, followUp: "2024-11-05", notes: ["Deposit paid ₹5000", "Delivery scheduled"], createdAt: "2024-10-22", assignedTo: "Suresh K." },
  { id: "l5", name: "Vikram Joshi", phone: "9567890123", email: "vikram@gmail.com", bikeId: "b6", franchiseId: "f2", stage: "contacted", source: "google_ads", score: 65, followUp: "2024-11-01", notes: [], createdAt: "2024-10-29", assignedTo: "Meera S." },
  { id: "l6", name: "Anita Singh", phone: "9456789012", email: "anita@gmail.com", bikeId: "b1", franchiseId: "f4", stage: "delivered", source: "referral", score: 100, followUp: null, notes: ["Delivered 27 Oct"], createdAt: "2024-10-15", assignedTo: "Priya J." },
  { id: "l7", name: "Deepak Rao", phone: "9345678901", email: "deepak@gmail.com", bikeId: "b7", franchiseId: "f3", stage: "lost", source: "website", score: 30, followUp: null, notes: ["Went to competitor"], createdAt: "2024-10-20", assignedTo: "Suresh K." },
  { id: "l8", name: "Kavita More", phone: "9234567890", email: "kavita@gmail.com", bikeId: "b5", franchiseId: "f4", stage: "new", source: "meta_ads", score: 70, followUp: "2024-11-03", notes: [], createdAt: "2024-10-30", assignedTo: "Priya J." },
];

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const STAGES = [
  { id: "new", label: "New", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  { id: "contacted", label: "Contacted", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)" },
  { id: "interested", label: "Interested", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  { id: "finance", label: "Finance", color: "#ec4899", bg: "rgba(236,72,153,0.12)" },
  { id: "booked", label: "Booked", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  { id: "delivered", label: "Delivered", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  { id: "lost", label: "Lost", color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
];

const SOURCES = ["website", "whatsapp", "meta_ads", "google_ads", "walk_in", "referral"];
const EMI_RATES = { 12: 9.5, 18: 10.0, 24: 10.5, 36: 11.0, 48: 11.5 };

// ── HELPERS ───────────────────────────────────────────────────────────────────
const calcOnRoad = (p) => p.exShowroom + p.rto + p.insurance + p.margin;
const calcEMI = (amount, months, rate) => {
  const r = rate / 100 / 12;
  return Math.round(amount * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
};
const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");
const stageOf = (id) => STAGES.find(s => s.id === id) || STAGES[0];
const bikeOf = (id) => MASTER_BIKES.find(b => b.id === id);
const franchiseOf = (id) => FRANCHISES.find(f => f.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const today = () => new Date().toISOString().split("T")[0];

// ── UI ATOMS ──────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", size = "md", style: sx = {}, disabled }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace",
    fontWeight: 500, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: 8, transition: "all 0.18s", opacity: disabled ? 0.5 : 1,
    fontSize: size === "sm" ? 11 : 12, padding: size === "sm" ? "6px 12px" : "10px 18px",
  };
  const variants = {
    primary: { background: "#f97316", color: "#000" },
    ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #1e2535" },
    danger: { background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" },
    success: { background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" },
    whatsapp: { background: "rgba(37,211,102,0.15)", color: "#25d366", border: "1px solid rgba(37,211,102,0.35)" },
  };
  return <button style={{ ...base, ...variants[variant], ...sx }} onClick={onClick} disabled={disabled}>{children}</button>;
};

const Badge = ({ children, color, bg }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 10, fontWeight: 500, color, background: bg, border: `1px solid ${color}40` }}>
    {children}
  </span>
);

const Card = ({ children, style: sx = {}, className = "" }) => (
  <div className={className} style={{ background: "#0d1117", border: "1px solid #1e2535", borderRadius: 14, padding: 24, ...sx }}>
    {children}
  </div>
);

const Modal = ({ title, onClose, children, width = 560 }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="scale-in" style={{ background: "#0d1117", border: "1px solid #1e2535", borderRadius: 16, width: "100%", maxWidth: width, maxHeight: "90vh", overflow: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #1e2535" }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{title}</span>
        <Btn variant="ghost" size="sm" onClick={onClose}>✕</Btn>
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  </div>
);

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>
      {label}{required && <span style={{ color: "#f97316" }}> *</span>}
    </label>
    {children}
  </div>
);

const Toast = ({ msg, type = "success", onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  const colors = { success: "#10b981", error: "#ef4444", info: "#3b82f6" };
  return (
    <div className="slide-in" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, background: "#0d1117", border: `1px solid ${colors[type]}40`, borderLeft: `3px solid ${colors[type]}`, borderRadius: 10, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
      <span style={{ color: colors[type] }}>{type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
      {msg}
    </div>
  );
};

const ScoreBadge = ({ score }) => {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color }}>{score}</div>
    </div>
  );
};

// ── SIDEBAR ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "◈", label: "Dashboard" },
  { id: "leads", icon: "◎", label: "Leads" },
  { id: "inventory", icon: "▦", label: "Inventory" },
  { id: "pricing", icon: "◇", label: "Pricing" },
  { id: "quotations", icon: "✦", label: "Quotations" },
];

const Sidebar = ({ active, setActive, franchise, setFranchise }) => (
  <aside style={{ width: 220, background: "#080a0f", borderRight: "1px solid #1e2535", display: "flex", flexDirection: "column", flexShrink: 0, position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
    {/* Logo */}
    <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e2535" }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, color: "#f97316" }}>Bikewalaa</div>
      <div style={{ fontSize: 9, color: "#3d4a5e", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>CRM Platform · MVP</div>
    </div>

    {/* Franchise selector */}
    <div style={{ padding: "12px 16px", borderBottom: "1px solid #1e2535" }}>
      <div style={{ fontSize: 9, color: "#3d4a5e", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Active Franchise</div>
      <select value={franchise} onChange={e => setFranchise(e.target.value)} style={{ padding: "8px 10px", fontSize: 11 }}>
        <option value="all">All Franchises (Admin)</option>
        {FRANCHISES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
    </div>

    {/* Nav */}
    <nav style={{ padding: "12px 10px", flex: 1 }}>
      {NAV.map(n => (
        <div key={n.id} onClick={() => setActive(n.id)}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, marginBottom: 2, cursor: "pointer", transition: "all 0.15s", background: active === n.id ? "rgba(249,115,22,0.1)" : "transparent", color: active === n.id ? "#f97316" : "#475569" }}>
          <span style={{ fontSize: 16 }}>{n.icon}</span>
          <span style={{ fontSize: 12, fontWeight: active === n.id ? 600 : 400 }}>{n.label}</span>
          {active === n.id && <div style={{ marginLeft: "auto", width: 3, height: 16, background: "#f97316", borderRadius: 2 }} />}
        </div>
      ))}
    </nav>

    {/* Bottom */}
    <div style={{ padding: 16, borderTop: "1px solid #1e2535" }}>
      <div style={{ fontSize: 10, color: "#3d4a5e" }}>v1.0 MVP · City Pilot</div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse2 2s infinite" }} />
        <span style={{ fontSize: 10, color: "#10b981" }}>Live · 4 Franchises</span>
      </div>
    </div>
  </aside>
);

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
const Dashboard = ({ leads, inventory, pricing }) => {
  const totalLeads = leads.length;
  const delivered = leads.filter(l => l.stage === "delivered").length;
  const convRate = ((delivered / totalLeads) * 100).toFixed(1);
  const revenue = delivered * 84500;
  const stageCount = (id) => leads.filter(l => l.stage === id).length;
  const totalStock = inventory.reduce((a, i) => a + i.stock, 0);
  const oos = inventory.filter(i => i.status === "out_of_stock").length;

  const StatCard = ({ label, value, sub, color = "#f97316", icon }) => (
    <Card className="fade-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 10, color: "#64748b", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>{label}</div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 28, opacity: 0.4 }}>{icon}</div>
      </div>
    </Card>
  );

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dashboard</div>
        <div style={{ fontSize: 12, color: "#475569" }}>City Pilot · Mumbai & Navi Mumbai · {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        <StatCard label="Total Leads" value={totalLeads} sub={`${stageCount("new")} new today`} color="#3b82f6" icon="◎" />
        <StatCard label="Conversions" value={delivered} sub={`${convRate}% conv. rate`} color="#10b981" icon="✓" />
        <StatCard label="Revenue" value={formatINR(revenue)} sub="Estimated GMV" color="#f97316" icon="◇" />
        <StatCard label="Total Stock" value={totalStock} sub={`${oos} out of stock`} color="#8b5cf6" icon="▦" />
      </div>

      {/* Pipeline overview */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Pipeline Overview</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {STAGES.map(s => (
            <div key={s.id} style={{ flex: 1, minWidth: 90, background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: s.color }}>{stageCount(s.id)}</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Franchise performance */}
      <Card>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Franchise Performance</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FRANCHISES.map(f => {
            const fLeads = leads.filter(l => l.franchiseId === f.id);
            const fDelivered = fLeads.filter(l => l.stage === "delivered").length;
            const fRate = fLeads.length ? ((fDelivered / fLeads.length) * 100).toFixed(0) : 0;
            const fInv = inventory.filter(i => i.franchiseId === f.id).reduce((a, i) => a + i.stock, 0);
            return (
              <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid #1e2535" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏪</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{f.city} · {f.owner}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#3b82f6" }}>{fLeads.length}</div>
                  <div style={{ fontSize: 9, color: "#475569" }}>leads</div>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#10b981" }}>{fDelivered}</div>
                  <div style={{ fontSize: 9, color: "#475569" }}>sold</div>
                </div>
                <div style={{ minWidth: 80 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#475569", marginBottom: 4 }}>
                    <span>{fRate}%</span><span>conv.</span>
                  </div>
                  <div style={{ background: "#1e2535", borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ width: `${fRate}%`, height: "100%", background: "linear-gradient(90deg, #f97316, #fbbf24)", borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 50 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#8b5cf6" }}>{fInv}</div>
                  <div style={{ fontSize: 9, color: "#475569" }}>stock</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

// ── LEADS ─────────────────────────────────────────────────────────────────────
const LeadRow = ({ lead, onSelect, onStageChange, pricing }) => {
  const bike = bikeOf(lead.bikeId);
  const stage = stageOf(lead.stage);
  const franchise = franchiseOf(lead.franchiseId);
  return (
    <div onClick={() => onSelect(lead)} style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 100px 80px", gap: 16, alignItems: "center", padding: "14px 20px", borderBottom: "1px solid #1e2535", cursor: "pointer", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = "#0a0d14"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{lead.name}</div>
        <div style={{ fontSize: 11, color: "#475569" }}>{lead.phone} · {franchise?.name}</div>
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>{bike?.img} {bike?.brand} {bike?.model}</div>
      <div>
        <select value={lead.stage} onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); onStageChange(lead.id, e.target.value); }}
          style={{ padding: "4px 8px", fontSize: 10, color: stage.color, background: stage.bg, border: `1px solid ${stage.color}40`, borderRadius: 100, width: "auto" }}>
          {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      <div style={{ fontSize: 10, color: "#475569", textTransform: "capitalize" }}>{lead.source.replace(/_/g, " ")}</div>
      <ScoreBadge score={lead.score} />
      <div style={{ fontSize: 10, color: "#475569" }}>{lead.followUp || "—"}</div>
    </div>
  );
};

const LeadDetail = ({ lead, onClose, onUpdate, pricing, setActiveTab, setQuoteTarget }) => {
  const [stage, setStage] = useState(lead.stage);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(lead.notes || []);
  const bike = bikeOf(lead.bikeId);
  const p = pricing[lead.bikeId];
  const onRoad = p ? calcOnRoad(p) : 0;

  const save = () => { onUpdate({ ...lead, stage, notes }); onClose(); };
  const addNote = () => { if (note.trim()) { setNotes([...notes, note.trim()]); setNote(""); } };
  const openQuote = () => { setQuoteTarget(lead); setActiveTab("quotations"); onClose(); };

  return (
    <Modal title={`Lead · ${lead.name}`} onClose={onClose} width={640}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left */}
        <div>
          <Field label="Customer"><input value={lead.name} readOnly /></Field>
          <Field label="Phone"><input value={lead.phone} readOnly /></Field>
          <Field label="Email"><input value={lead.email} readOnly /></Field>
          <Field label="Source"><input value={lead.source.replace(/_/g, " ")} readOnly /></Field>
          <Field label="Franchise"><input value={franchiseOf(lead.franchiseId)?.name} readOnly /></Field>
          <Field label="Assigned To"><input value={lead.assignedTo} readOnly /></Field>
        </div>
        {/* Right */}
        <div>
          <Field label="Bike of Interest">
            <div style={{ background: "#080a0f", border: "1px solid #1e2535", borderRadius: 8, padding: "10px 14px" }}>
              <div style={{ fontSize: 14 }}>{bike?.img} {bike?.brand} {bike?.model}</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{bike?.variant} · {bike?.cc}cc · {bike?.category}</div>
              {p && <div style={{ fontSize: 12, color: "#f97316", marginTop: 6, fontWeight: 600 }}>On-Road: {formatINR(onRoad)}</div>}
            </div>
          </Field>
          <Field label="Pipeline Stage">
            <select value={stage} onChange={e => setStage(e.target.value)}>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Lead Score">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ScoreBadge score={lead.score} />
              <div style={{ flex: 1, background: "#1e2535", borderRadius: 4, height: 6 }}>
                <div style={{ width: `${lead.score}%`, height: "100%", background: lead.score >= 80 ? "#10b981" : lead.score >= 60 ? "#f59e0b" : "#ef4444", borderRadius: 4 }} />
              </div>
            </div>
          </Field>
          <Field label="Follow-up Date"><input value={lead.followUp || ""} readOnly /></Field>
          <Field label="Created"><input value={lead.createdAt} readOnly /></Field>
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginTop: 8, borderTop: "1px solid #1e2535", paddingTop: 20 }}>
        <div style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Notes & Activity</div>
        <div style={{ maxHeight: 100, overflowY: "auto", marginBottom: 10 }}>
          {notes.length === 0 ? <div style={{ fontSize: 11, color: "#3d4a5e" }}>No notes yet</div> :
            notes.map((n, i) => <div key={i} style={{ fontSize: 12, padding: "6px 0", borderBottom: "1px solid #1e2535", color: "#94a3b8" }}>→ {n}</div>)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Add note..." value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} />
          <Btn variant="ghost" size="sm" onClick={addNote}>Add</Btn>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
        <Btn onClick={save}>💾 Save Changes</Btn>
        <Btn variant="whatsapp" onClick={openQuote}>📲 Generate Quote</Btn>
        <Btn variant="ghost" onClick={onClose} style={{ marginLeft: "auto" }}>Cancel</Btn>
      </div>
    </Modal>
  );
};

const AddLeadModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", bikeId: "b1", franchiseId: "f1", source: "website", assignedTo: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name || !form.phone) return;
    onAdd({ ...form, id: "l" + uid(), stage: "new", score: Math.floor(Math.random() * 30 + 60), followUp: today(), notes: [], createdAt: today() });
    onClose();
  };

  return (
    <Modal title="Add New Lead" onClose={onClose}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Field label="Customer Name" required><input placeholder="Full name" value={form.name} onChange={e => set("name", e.target.value)} /></Field>
        <Field label="Phone" required><input placeholder="10-digit mobile" value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
        <Field label="Email"><input placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} /></Field>
        <Field label="Source">
          <select value={form.source} onChange={e => set("source", e.target.value)}>
            {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </Field>
        <Field label="Bike of Interest">
          <select value={form.bikeId} onChange={e => set("bikeId", e.target.value)}>
            {MASTER_BIKES.map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}
          </select>
        </Field>
        <Field label="Assign to Franchise">
          <select value={form.franchiseId} onChange={e => set("franchiseId", e.target.value)}>
            {FRANCHISES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </Field>
        <Field label="Assigned To (Exec)"><input placeholder="Sales exec name" value={form.assignedTo} onChange={e => set("assignedTo", e.target.value)} /></Field>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Btn onClick={submit}>+ Create Lead</Btn>
        <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
};

const Leads = ({ leads, setLeads, pricing, setActiveTab, setQuoteTarget, franchise }) => {
  const [filter, setFilter] = useState({ stage: "all", source: "all", search: "" });
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);

  const filtered = leads.filter(l => {
    if (franchise !== "all" && l.franchiseId !== franchise) return false;
    if (filter.stage !== "all" && l.stage !== filter.stage) return false;
    if (filter.source !== "all" && l.source !== filter.source) return false;
    if (filter.search && !l.name.toLowerCase().includes(filter.search.toLowerCase()) && !l.phone.includes(filter.search)) return false;
    return true;
  });

  const updateLead = (updated) => setLeads(ls => ls.map(l => l.id === updated.id ? updated : l));
  const stageChange = (id, stage) => setLeads(ls => ls.map(l => l.id === id ? { ...l, stage } : l));
  const addLead = (lead) => setLeads(ls => [lead, ...ls]);

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Leads</div>
          <div style={{ fontSize: 12, color: "#475569" }}>{filtered.length} leads {franchise !== "all" ? `· ${franchiseOf(franchise)?.name}` : "· All Franchises"}</div>
        </div>
        <Btn onClick={() => setAdding(true)}>+ New Lead</Btn>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 16, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <input placeholder="🔍 Search name or phone..." value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} style={{ flex: 1, minWidth: 200 }} />
          <select value={filter.stage} onChange={e => setFilter(f => ({ ...f, stage: e.target.value }))} style={{ width: 140 }}>
            <option value="all">All Stages</option>
            {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <select value={filter.source} onChange={e => setFilter(f => ({ ...f, source: e.target.value }))} style={{ width: 140 }}>
            <option value="all">All Sources</option>
            {SOURCES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </div>
      </Card>

      {/* Stage pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {STAGES.map(s => (
          <div key={s.id} onClick={() => setFilter(f => ({ ...f, stage: f.stage === s.id ? "all" : s.id }))}
            style={{ padding: "5px 14px", borderRadius: 100, fontSize: 11, cursor: "pointer", border: `1px solid ${s.color}40`, background: filter.stage === s.id ? s.bg : "transparent", color: filter.stage === s.id ? s.color : "#475569" }}>
            {s.label} · {leads.filter(l => (franchise === "all" || l.franchiseId === franchise) && l.stage === s.id).length}
          </div>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 130px 120px 100px 80px", gap: 16, padding: "10px 20px", background: "#080a0f", borderBottom: "1px solid #1e2535" }}>
          {["Customer", "Bike", "Stage", "Source", "Score", "Follow-up"].map(h => (
            <div key={h} style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#3d4a5e", fontSize: 13 }}>No leads found</div>
        ) : (
          filtered.map(l => <LeadRow key={l.id} lead={l} onSelect={setSelected} onStageChange={stageChange} pricing={pricing} />)
        )}
      </Card>

      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} onUpdate={updateLead} pricing={pricing} setActiveTab={setActiveTab} setQuoteTarget={setQuoteTarget} />}
      {adding && <AddLeadModal onClose={() => setAdding(false)} onAdd={addLead} />}
    </div>
  );
};

// ── INVENTORY ─────────────────────────────────────────────────────────────────
const Inventory = ({ inventory, setInventory, franchise }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ bikeId: "b1", franchiseId: "f1", color: "", stock: 1 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = franchise === "all" ? inventory : inventory.filter(i => i.franchiseId === franchise);

  const grouped = MASTER_BIKES.map(bike => ({
    bike,
    items: filtered.filter(i => i.bikeId === bike.id),
    totalStock: filtered.filter(i => i.bikeId === bike.id).reduce((a, i) => a + i.stock, 0),
  })).filter(g => franchise === "all" || g.items.length > 0);

  const addStock = () => {
    if (!form.color) return;
    const exists = inventory.find(i => i.bikeId === form.bikeId && i.franchiseId === form.franchiseId && i.color === form.color);
    if (exists) {
      setInventory(inv => inv.map(i => i.id === exists.id ? { ...i, stock: i.stock + Number(form.stock) } : i));
    } else {
      setInventory(inv => [...inv, { id: "i" + uid(), bikeId: form.bikeId, franchiseId: form.franchiseId, status: "available", color: form.color, chassis: "NEW" + uid().toUpperCase(), stock: Number(form.stock) }]);
    }
    setAdding(false);
  };

  const updateStock = (id, delta) => {
    setInventory(inv => inv.map(i => {
      if (i.id !== id) return i;
      const ns = Math.max(0, i.stock + delta);
      return { ...i, stock: ns, status: ns === 0 ? "out_of_stock" : "available" };
    }));
  };

  const statusColor = (s) => s === "available" ? "#10b981" : s === "reserved" ? "#f59e0b" : "#ef4444";
  const statusBg = (s) => s === "available" ? "rgba(16,185,129,0.1)" : s === "reserved" ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";

  const totalUnits = filtered.reduce((a, i) => a + i.stock, 0);
  const availableItems = filtered.filter(i => i.status === "available");
  const oosItems = filtered.filter(i => i.status === "out_of_stock");

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Inventory</div>
          <div style={{ fontSize: 12, color: "#475569" }}>{totalUnits} total units · {franchise !== "all" ? franchiseOf(franchise)?.name : "All Franchises"}</div>
        </div>
        <Btn onClick={() => setAdding(true)}>+ Add Stock</Btn>
      </div>

      {/* Summary pills */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 10, padding: "12px 20px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: "#10b981" }}>{availableItems.reduce((a, i) => a + i.stock, 0)}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>Available</div>
        </div>
        <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 10, padding: "12px 20px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: "#f59e0b" }}>{filtered.filter(i => i.status === "reserved").reduce((a, i) => a + i.stock, 0)}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>Reserved</div>
        </div>
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "12px 20px" }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{oosItems.length}</div>
          <div style={{ fontSize: 10, color: "#475569" }}>Out of Stock</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {grouped.map(({ bike, items, totalStock }) => (
          <Card key={bike.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: items.length > 0 ? "1px solid #1e2535" : "none", background: "#080a0f" }}>
              <div style={{ fontSize: 24 }}>{bike.img}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{bike.brand} {bike.model}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{bike.variant} · {bike.cc}cc · {bike.category}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: totalStock > 5 ? "#10b981" : totalStock > 0 ? "#f59e0b" : "#ef4444" }}>{totalStock}</div>
                <div style={{ fontSize: 10, color: "#475569" }}>total units</div>
              </div>
            </div>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: "1px solid #0d1117" }}>
                <div style={{ fontSize: 10, color: "#475569", width: 120 }}>{franchiseOf(item.franchiseId)?.name}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{item.color}</div>
                <Badge color={statusColor(item.status)} bg={statusBg(item.status)}>{item.status.replace(/_/g, " ")}</Badge>
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                  <Btn variant="ghost" size="sm" onClick={() => updateStock(item.id, -1)}>−</Btn>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, minWidth: 30, textAlign: "center" }}>{item.stock}</div>
                  <Btn variant="ghost" size="sm" onClick={() => updateStock(item.id, 1)}>+</Btn>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div style={{ padding: "12px 20px", fontSize: 12, color: "#3d4a5e" }}>No stock at this franchise</div>
            )}
          </Card>
        ))}
      </div>

      {adding && (
        <Modal title="Add Stock" onClose={() => setAdding(false)} width={440}>
          <Field label="Bike">
            <select value={form.bikeId} onChange={e => set("bikeId", e.target.value)}>
              {MASTER_BIKES.map(b => <option key={b.id} value={b.id}>{b.brand} {b.model}</option>)}
            </select>
          </Field>
          <Field label="Franchise">
            <select value={form.franchiseId} onChange={e => set("franchiseId", e.target.value)}>
              {FRANCHISES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </Field>
          <Field label="Color Variant"><input placeholder="e.g. Pearl Black" value={form.color} onChange={e => set("color", e.target.value)} /></Field>
          <Field label="Units to Add"><input type="number" min={1} value={form.stock} onChange={e => set("stock", e.target.value)} /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Btn onClick={addStock}>Add to Inventory</Btn>
            <Btn variant="ghost" onClick={() => setAdding(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PRICING ───────────────────────────────────────────────────────────────────
const Pricing = ({ pricing, setPricing }) => {
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [emiPreview, setEmiPreview] = useState(null);

  const openEdit = (bikeId) => {
    setEditing(bikeId);
    setEditForm({ ...pricing[bikeId] });
  };

  const saveEdit = () => {
    setPricing(p => ({ ...p, [editing]: { ...editForm, exShowroom: Number(editForm.exShowroom), rto: Number(editForm.rto), insurance: Number(editForm.insurance), margin: Number(editForm.margin), minFloor: Number(editForm.minFloor) } }));
    setEditing(null);
  };

  const set = (k, v) => setEditForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Dynamic Pricing</div>
        <div style={{ fontSize: 12, color: "#475569" }}>Central pricing control · Margin-protected · EMI calculator included</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MASTER_BIKES.map(bike => {
          const p = pricing[bike.id];
          if (!p) return null;
          const onRoad = calcOnRoad(p);
          const marginOk = p.margin >= p.minFloor;
          return (
            <Card key={bike.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px" }}>
                <div style={{ fontSize: 26 }}>{bike.img}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{bike.brand} {bike.model} · {bike.variant}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{bike.cc}cc · {bike.fuel} · {bike.category}</div>
                  {p.offers.length > 0 && (
                    <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                      {p.offers.map((o, i) => <Badge key={i} color="#fbbf24" bg="rgba(251,191,36,0.1)">🎁 {o}</Badge>)}
                    </div>
                  )}
                </div>

                {/* Price breakdown mini */}
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Ex-Showroom</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatINR(p.exShowroom)}</div>
                  </div>
                  <div style={{ color: "#1e2535" }}>+</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>RTO+Ins.</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{formatINR(p.rto + p.insurance)}</div>
                  </div>
                  <div style={{ color: "#1e2535" }}>+</div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: marginOk ? "#10b981" : "#ef4444", marginBottom: 2 }}>Margin {marginOk ? "✓" : "⚠"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: marginOk ? "#10b981" : "#ef4444" }}>{formatINR(p.margin)}</div>
                  </div>
                  <div style={{ color: "#1e2535" }}>=</div>
                  <div style={{ textAlign: "right", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 8, padding: "8px 14px" }}>
                    <div style={{ fontSize: 10, color: "#f97316", marginBottom: 2 }}>On-Road</div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: "#f97316" }}>{formatINR(onRoad)}</div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
                  <Btn variant="ghost" size="sm" onClick={() => setEmiPreview({ bike, p, onRoad })}>EMI</Btn>
                  <Btn size="sm" onClick={() => openEdit(bike.id)}>Edit</Btn>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editing && (
        <Modal title={`Edit Pricing · ${bikeOf(editing)?.brand} ${bikeOf(editing)?.model}`} onClose={() => setEditing(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Field label="Ex-Showroom Price (₹)"><input type="number" value={editForm.exShowroom} onChange={e => set("exShowroom", e.target.value)} /></Field>
            <Field label="RTO Charges (₹)"><input type="number" value={editForm.rto} onChange={e => set("rto", e.target.value)} /></Field>
            <Field label="Insurance (₹)"><input type="number" value={editForm.insurance} onChange={e => set("insurance", e.target.value)} /></Field>
            <Field label="Franchise Margin (₹)"><input type="number" value={editForm.margin} onChange={e => set("margin", e.target.value)} /></Field>
            <Field label="Minimum Margin Floor (₹)"><input type="number" value={editForm.minFloor} onChange={e => set("minFloor", e.target.value)} /></Field>
          </div>
          <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: 16, marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "#f97316", marginBottom: 6 }}>New On-Road Price</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#f97316" }}>
              {formatINR(Number(editForm.exShowroom || 0) + Number(editForm.rto || 0) + Number(editForm.insurance || 0) + Number(editForm.margin || 0))}
            </div>
            {Number(editForm.margin) < Number(editForm.minFloor) && (
              <div style={{ color: "#ef4444", fontSize: 11, marginTop: 8 }}>⚠ Margin below floor ({formatINR(editForm.minFloor)})</div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn onClick={saveEdit}>Save Pricing</Btn>
            <Btn variant="ghost" onClick={() => setEditing(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* EMI Preview Modal */}
      {emiPreview && (
        <Modal title={`EMI Calculator · ${emiPreview.bike.brand} ${emiPreview.bike.model}`} onClose={() => setEmiPreview(null)} width={480}>
          <div style={{ background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 10, padding: 16, marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "#f97316", marginBottom: 4 }}>On-Road Price</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: "#f97316" }}>{formatINR(emiPreview.onRoad)}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {Object.entries(EMI_RATES).map(([months, rate]) => {
              const emi = calcEMI(emiPreview.onRoad, Number(months), rate);
              return (
                <div key={months} style={{ background: "#080a0f", border: "1px solid #1e2535", borderRadius: 10, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#475569", marginBottom: 8 }}>{months} months · {rate}% p.a.</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: "#3b82f6" }}>{formatINR(emi)}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>per month</div>
                  <div style={{ fontSize: 10, color: "#3d4a5e", marginTop: 2 }}>Total: {formatINR(emi * Number(months))}</div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: "#3d4a5e", marginTop: 16, textAlign: "center" }}>* Indicative EMI · Actual rate subject to NBFC / bank approval</div>
        </Modal>
      )}
    </div>
  );
};

// ── QUOTATIONS ────────────────────────────────────────────────────────────────
const Quotations = ({ leads, pricing, quoteTarget, setQuoteTarget }) => {
  const [quotes, setQuotes] = useState([]);
  const [creating, setCreating] = useState(null);
  const [previewQuote, setPreviewQuote] = useState(null);

  useEffect(() => { if (quoteTarget) { setCreating(quoteTarget); setQuoteTarget(null); } }, [quoteTarget]);

  const QuoteCreator = ({ lead, onClose }) => {
    const bike = bikeOf(lead.bikeId);
    const p = pricing[lead.bikeId] || {};
    const onRoad = p ? calcOnRoad(p) : 0;
    const [tenure, setTenure] = useState(24);
    const [downPayment, setDownPayment] = useState(0);
    const [customNote, setCustomNote] = useState("");
    const [includeOffers, setIncludeOffers] = useState(true);

    const loanAmt = onRoad - Number(downPayment);
    const emi = calcEMI(loanAmt, tenure, EMI_RATES[tenure] || 10.5);
    const offerSavings = includeOffers ? (p.offers?.length || 0) * 3000 : 0;
    const finalPrice = onRoad - offerSavings;

    const msgLines = [
      `🏍️ *${bike?.brand} ${bike?.model} — ${bike?.variant}*`,
      ``,
      `💰 *On-Road Price: ${formatINR(finalPrice)}*`,
      offerSavings > 0 ? `🎁 Offer Savings: ${formatINR(offerSavings)}` : null,
      downPayment > 0 ? `💵 Down Payment: ${formatINR(downPayment)}` : null,
      `📅 EMI: *${formatINR(emi)}/mo × ${tenure} months*`,
      `📊 Rate: ${EMI_RATES[tenure]}% p.a.`,
      ``,
      `✅ Zero documentation hassle`,
      `🚀 Fast delivery · All cities`,
      customNote ? `\n📌 ${customNote}` : null,
      ``,
      `⏰ Quote valid for 48 hours`,
      ``,
      `📞 Contact: Bikewalaa · www.bikewalaa.com`,
    ].filter(Boolean).join("\n");

    const waLink = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(msgLines)}`;

    const saveAndSend = () => {
      const q = {
        id: "q" + uid(),
        leadId: lead.id,
        leadName: lead.name,
        phone: lead.phone,
        bikeId: lead.bikeId,
        bikeName: `${bike?.brand} ${bike?.model}`,
        tenure,
        emi,
        onRoad: finalPrice,
        status: "sent",
        sentAt: new Date().toISOString(),
        waLink,
        msg: msgLines,
      };
      setQuotes(qs => [q, ...qs]);
      window.open(waLink, "_blank");
      onClose();
    };

    return (
      <Modal title={`WhatsApp Quote · ${lead.name}`} onClose={onClose} width={680}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Config */}
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 16, fontSize: 13 }}>Configure Quote</div>
            <Field label="Customer"><input value={`${lead.name} · ${lead.phone}`} readOnly /></Field>
            <Field label="Bike"><input value={`${bike?.brand} ${bike?.model} · ${bike?.variant}`} readOnly /></Field>
            <Field label="On-Road Price"><input value={formatINR(onRoad)} readOnly /></Field>
            <Field label="EMI Tenure">
              <select value={tenure} onChange={e => setTenure(Number(e.target.value))}>
                {Object.entries(EMI_RATES).map(([m, r]) => <option key={m} value={m}>{m} months @ {r}%</option>)}
              </select>
            </Field>
            <Field label="Down Payment (₹)"><input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)} placeholder="0 for zero down payment" /></Field>
            <Field label="Personal Note"><textarea rows={2} value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Add a personal message..." /></Field>
            {p.offers?.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <input type="checkbox" checked={includeOffers} onChange={e => setIncludeOffers(e.target.checked)} style={{ width: "auto" }} />
                <label style={{ fontSize: 12, color: "#94a3b8" }}>Include active offers ({p.offers.join(", ")})</label>
              </div>
            )}
          </div>

          {/* Preview */}
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 16, fontSize: 13 }}>WhatsApp Preview</div>
            <div style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.2)", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: "1px solid rgba(37,211,102,0.15)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(37,211,102,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛵</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#25d366" }}>Bikewalaa</div>
                  <div style={{ fontSize: 9, color: "#475569" }}>Business Account</div>
                </div>
              </div>
              <pre style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "pre-wrap", fontFamily: "'DM Mono', monospace", lineHeight: 1.7 }}>{msgLines}</pre>
            </div>

            <div style={{ marginTop: 16, background: "#080a0f", border: "1px solid #1e2535", borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>Monthly EMI</span>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#3b82f6" }}>{formatINR(emi)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>Total Payout</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{formatINR(emi * tenure)}</span>
              </div>
              {offerSavings > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11, color: "#fbbf24" }}>Offer Savings</span>
                  <span style={{ fontSize: 13, color: "#fbbf24" }}>−{formatINR(offerSavings)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e2535" }}>
          <Btn variant="whatsapp" onClick={saveAndSend}>📲 Send on WhatsApp</Btn>
          <Btn variant="ghost" onClick={() => setPreviewQuote({ msg: msgLines, lead, bike, emi, tenure, finalPrice })} size="sm">Preview Full</Btn>
          <Btn variant="ghost" onClick={onClose} style={{ marginLeft: "auto" }}>Cancel</Btn>
        </div>
      </Modal>
    );
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Quotations</div>
          <div style={{ fontSize: 12, color: "#475569" }}>WhatsApp quote generator · {quotes.length} quotes sent this session</div>
        </div>
        <Btn onClick={() => setCreating(leads[0])} variant="ghost">+ Manual Quote</Btn>
      </div>

      {/* Quick-fire from leads */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Hot Leads — Ready to Quote</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {leads.filter(l => ["interested", "finance", "contacted"].includes(l.stage)).slice(0, 6).map(lead => {
            const bike = bikeOf(lead.bikeId);
            const p = pricing[lead.bikeId];
            const stage = stageOf(lead.stage);
            return (
              <div key={lead.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "10px 16px", background: "#080a0f", borderRadius: 10, border: "1px solid #1e2535" }}>
                <ScoreBadge score={lead.score} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{lead.name}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{bike?.brand} {bike?.model} · {lead.phone}</div>
                </div>
                <Badge color={stage.color} bg={stage.bg}>{stage.label}</Badge>
                {p && <div style={{ fontSize: 12, color: "#f97316", fontWeight: 600 }}>{formatINR(calcOnRoad(p))}</div>}
                <Btn variant="whatsapp" size="sm" onClick={() => setCreating(lead)}>📲 Quote</Btn>
              </div>
            );
          })}
          {leads.filter(l => ["interested", "finance", "contacted"].includes(l.stage)).length === 0 && (
            <div style={{ fontSize: 12, color: "#3d4a5e", padding: 12 }}>No hot leads at the moment</div>
          )}
        </div>
      </Card>

      {/* Sent quotes */}
      <Card>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Quotes Sent This Session</div>
        {quotes.length === 0 ? (
          <div style={{ padding: "32px 0", textAlign: "center", color: "#3d4a5e", fontSize: 13 }}>No quotes sent yet. Use the hot leads above to fire your first quote! 🚀</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quotes.map(q => (
              <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "#080a0f", borderRadius: 10, border: "1px solid #1e2535" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(37,211,102,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>📲</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{q.leadName}</div>
                  <div style={{ fontSize: 11, color: "#475569" }}>{q.bikeName} · {q.phone}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#f97316", fontWeight: 600 }}>{formatINR(q.onRoad)}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>EMI {formatINR(q.emi)}/mo × {q.tenure}</div>
                </div>
                <Badge color="#25d366" bg="rgba(37,211,102,0.1)">Sent</Badge>
                <Btn variant="whatsapp" size="sm" onClick={() => window.open(q.waLink, "_blank")}>Resend</Btn>
              </div>
            ))}
          </div>
        )}
      </Card>

      {creating && <QuoteCreator lead={creating} onClose={() => setCreating(null)} />}
    </div>
  );
};

// ── APP SHELL ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [franchise, setFranchise] = useState("all");
  const [leads, setLeads] = useState(initLeads());
  const [inventory, setInventory] = useState(initInventory());
  const [pricing, setPricing] = useState(initPricing());
  const [quoteTarget, setQuoteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "success") => { setToast({ msg, type }); }, []);

  const wrappedSetLeads = useCallback((fn) => {
    setLeads(fn);
    showToast("Lead updated successfully");
  }, [showToast]);

  const wrappedSetInventory = useCallback((fn) => {
    setInventory(fn);
    showToast("Inventory updated");
  }, [showToast]);

  const wrappedSetPricing = useCallback((fn) => {
    setPricing(fn);
    showToast("Pricing saved · Website will sync in real-time");
  }, [showToast]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080a0f" }}>
      <Sidebar active={activeTab} setActive={setActiveTab} franchise={franchise} setFranchise={setFranchise} />

      <main style={{ marginLeft: 220, flex: 1, padding: "32px 32px 48px", overflowX: "hidden", minHeight: "100vh" }}>
        {activeTab === "dashboard" && <Dashboard leads={leads} inventory={inventory} pricing={pricing} />}
        {activeTab === "leads" && <Leads leads={leads} setLeads={wrappedSetLeads} pricing={pricing} setActiveTab={setActiveTab} setQuoteTarget={setQuoteTarget} franchise={franchise} />}
        {activeTab === "inventory" && <Inventory inventory={inventory} setInventory={wrappedSetInventory} franchise={franchise} />}
        {activeTab === "pricing" && <Pricing pricing={pricing} setPricing={wrappedSetPricing} />}
        {activeTab === "quotations" && <Quotations leads={leads} pricing={pricing} quoteTarget={quoteTarget} setQuoteTarget={setQuoteTarget} />}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
