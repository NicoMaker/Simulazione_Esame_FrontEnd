import React, { useState } from "react";
import { useApp } from "../App";
import { SPACE_TYPE_LABELS } from "../data";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Clock, Euro, Search, X } from "lucide-react";

const COLORS_PIE = ["#4f7cff", "#a855f7", "#10d9a0"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      {label && <div className="label">{label}</div>}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{ color: p.color, fontSize: "0.82rem", marginTop: 2 }}
        >
          {p.name}:{" "}
          <strong>
            {p.name?.includes("€") || p.name === "Fatturato" ? "€" : ""}
            {p.value?.toLocaleString("it-IT")}
          </strong>
        </div>
      ))}
    </div>
  );
}

function PieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
}

export default function ReportsDashboard() {
  const { bookings, spaces } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cancelledFilter, setCancelledFilter] = useState(false);

  const confirmed = bookings.filter((b) => b.status === "confirmed");

  // ─── Stats ───
  const totalRevenue = confirmed.reduce((s, b) => s + b.totalCost, 0);
  const avgRevenue = confirmed.length
    ? (totalRevenue / confirmed.length).toFixed(0)
    : 0;
  const totalHours = confirmed.reduce((s, b) => s + b.hours, 0);

  // ─── Pie: type distribution ───
  const byType = ["desk", "meeting", "office"].map((type) => ({
    name: SPACE_TYPE_LABELS[type],
    value: confirmed.filter((b) => b.spaceType === type).length,
  }));

  // ─── Bar: occupancy by space ───
  const topSpaces = spaces
    .map((s) => ({
      name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
      prenotazioni: confirmed.filter((b) => b.spaceId === s.id).length,
      fatturato: confirmed
        .filter((b) => b.spaceId === s.id)
        .reduce((acc, b) => acc + b.totalCost, 0),
    }))
    .filter((s) => s.prenotazioni > 0)
    .sort((a, b) => b.prenotazioni - a.prenotazioni)
    .slice(0, 7);

  // ─── Line: revenue over time (last 20 days) ───
  const last20 = Array.from({ length: 20 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (19 - i));
    const key = d.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
    });
    const dayBookings = confirmed.filter((b) => {
      const bd = new Date(b.date);
      return bd.toDateString() === d.toDateString();
    });
    return {
      giorno: key,
      Fatturato: dayBookings.reduce((s, b) => s + b.totalCost, 0),
      Prenotazioni: dayBookings.length,
    };
  });

  // ─── Bar: weekly comparison ───
  const weeklyRevenue = Array.from({ length: 4 }, (_, w) => {
    const weekLabel = `Settimana ${4 - w}`;
    const start = 7 * (w + 1);
    const end = 7 * w;
    const weekBookings = confirmed.filter((b) => {
      const daysAgo = (Date.now() - new Date(b.date).getTime()) / 86400000;
      return daysAgo >= end && daysAgo < start;
    });
    return {
      settimana: weekLabel,
      Fatturato: weekBookings.reduce((s, b) => s + b.totalCost, 0),
      Prenotazioni: weekBookings.length,
    };
  }).reverse();

  // ─── Occupancy rate ───
  const totalSlots = spaces.length * 20; // theoretical
  const occupancyRate = Math.round((confirmed.length / totalSlots) * 100);

  // ─── Filtered table ───
  const tableData = [...bookings]
    .filter((b) => {
      if (!cancelledFilter && b.status === "cancelled") return false;
      if (typeFilter !== "all" && b.spaceType !== typeFilter) return false;
      if (
        search &&
        !b.customerName.toLowerCase().includes(search.toLowerCase()) &&
        !b.spaceName.toLowerCase().includes(search.toLowerCase()) &&
        !b.id.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Reportistica & Analytics</div>
        <div className="page-subtitle">
          Analisi delle performance e andamento prenotazioni
        </div>
      </div>

      {/* KPI Row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <TrendingUp size={20} />
          </div>
          <div className="stat-value">
            €{totalRevenue.toLocaleString("it-IT")}
          </div>
          <div className="stat-label">Fatturato Totale</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">
            <Calendar size={20} />
          </div>
          <div className="stat-value">{confirmed.length}</div>
          <div className="stat-label">Prenotazioni Confermate</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber">
            <Clock size={20} />
          </div>
          <div className="stat-value">{totalHours}h</div>
          <div className="stat-label">Ore Totali Prenotate</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-icon violet">
            <Euro size={20} />
          </div>
          <div className="stat-value">€{avgRevenue}</div>
          <div className="stat-label">Valore Medio Prenotazione</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="charts-grid" style={{ marginBottom: 20 }}>
        {/* Pie: space types */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🍕 Tipologia Spazi Richiesti</div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={byType}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                  label={PieLabel}
                >
                  {byType.map((_, i) => (
                    <Cell key={i} fill={COLORS_PIE[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(v) => (
                    <span
                      style={{ color: "var(--text-secondary)", fontSize: 12 }}
                    >
                      {v}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: top spaces */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Spazi più Prenotati</div>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={topSpaces}
                margin={{ top: 0, right: 10, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="prenotazioni"
                  name="Prenotazioni"
                  fill="var(--accent)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line: revenue over time */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">
            📈 Andamento Fatturato (ultimi 20 giorni)
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Tasso di occupazione medio:{" "}
            <strong style={{ color: "var(--accent)" }}>{occupancyRate}%</strong>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={last20}
              margin={{ top: 0, right: 20, bottom: 0, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="giorno" tick={{ fontSize: 10 }} interval={3} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => (
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 12 }}
                  >
                    {v}
                  </span>
                )}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Fatturato"
                stroke="var(--emerald)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Prenotazioni"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly comparison bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div className="card-title">📅 Confronto Settimanale</div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={weeklyRevenue}
              margin={{ top: 0, right: 20, bottom: 0, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="settimana" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => (
                  <span
                    style={{ color: "var(--text-secondary)", fontSize: 12 }}
                  >
                    {v}
                  </span>
                )}
              />
              <Bar
                dataKey="Fatturato"
                fill="var(--accent)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Prenotazioni"
                fill="var(--violet)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">📋 Elenco Cronologico Prenotazioni</div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={cancelledFilter}
                onChange={(e) => setCancelledFilter(e.target.checked)}
                style={{ accentColor: "var(--accent)" }}
              />
              Mostra annullate
            </label>
          </div>
        </div>
        <div
          style={{
            padding: "12px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div className="filter-bar" style={{ marginBottom: 0 }}>
            {[
              { id: "all", label: "Tutti" },
              { id: "desk", label: "💻 Scrivanie" },
              { id: "meeting", label: "🤝 Riunioni" },
              { id: "office", label: "🏠 Uffici" },
            ].map((f) => (
              <button
                key={f.id}
                className={`filter-chip ${typeFilter === f.id ? "active" : ""}`}
                onClick={() => setTypeFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="search-wrap" style={{ marginLeft: "auto" }}>
            <Search className="search-icon" />
            <input
              className="search-input"
              placeholder="Cerca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Spazio</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Fascia Oraria</th>
                <th>Durata</th>
                <th>Importo</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      textAlign: "center",
                      padding: 40,
                      color: "var(--text-muted)",
                    }}
                  >
                    Nessuna prenotazione trovata
                  </td>
                </tr>
              ) : (
                tableData.map((b) => {
                  const date = new Date(b.date).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });
                  return (
                    <tr
                      key={b.id}
                      style={{ opacity: b.status === "cancelled" ? 0.5 : 1 }}
                    >
                      <td>
                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            fontSize: "0.82rem",
                            color: "var(--accent)",
                          }}
                        >
                          {b.id}
                        </span>
                      </td>
                      <td>{b.customerName}</td>
                      <td>{b.spaceName}</td>
                      <td>
                        <span className={`badge badge-${b.spaceType}`}>
                          {SPACE_TYPE_LABELS[b.spaceType]}
                        </span>
                      </td>
                      <td>{date}</td>
                      <td>
                        {b.startTime} – {b.endTime}
                      </td>
                      <td>{b.hours}h</td>
                      <td
                        style={{
                          color: "var(--emerald)",
                          fontWeight: 700,
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        €{b.totalCost}
                      </td>
                      <td>
                        <span className={`badge badge-${b.status}`}>
                          {b.status === "confirmed"
                            ? "Confermata"
                            : "Annullata"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div
          style={{
            padding: "12px 18px",
            borderTop: "1px solid var(--border)",
            fontSize: "0.78rem",
            color: "var(--text-muted)",
          }}
        >
          {tableData.length} prenotazioni mostrate
        </div>
      </div>
    </div>
  );
}
