import React, { useState } from "react";
import { useApp } from "../App";
import { SPACE_TYPE_LABELS } from "../data";
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  MonitorPlay,
  Users,
  Briefcase,
  Building2,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const TYPE_ICONS = { desk: MonitorPlay, meeting: Users, office: Briefcase };
const TYPE_COLORS = {
  desk: "var(--accent)",
  meeting: "var(--violet)",
  office: "var(--emerald)",
};

function StepsBar({ current }) {
  const steps = ["Scegli Spazio", "Dati Prenotazione", "Conferma"];
  return (
    <div className="steps-bar">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "";
        return (
          <React.Fragment key={i}>
            <div className={`step ${state}`}>
              <div className="step-dot">
                {i < current ? <Check size={14} /> : i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`step-line ${i < current ? "done" : ""}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Step1SelectSpace({
  spaces,
  selected,
  onSelect,
  typeFilter,
  setTypeFilter,
}) {
  const available = spaces.filter((s) => s.status === "available");
  const filtered =
    typeFilter === "all"
      ? available
      : available.filter((s) => s.type === typeFilter);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: 4,
          }}
        >
          Seleziona lo spazio
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Sono mostrati solo gli spazi attualmente disponibili
        </div>
      </div>
      <div className="filter-bar">
        {[
          { id: "all", label: "Tutti" },
          { id: "desk", label: "💻 Scrivanie" },
          { id: "meeting", label: "🤝 Sale Riunioni" },
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
      {filtered.length === 0 ? (
        <div className="empty-state" style={{ padding: "30px 20px" }}>
          <div className="empty-state-icon">😴</div>
          <h3>Nessuno spazio disponibile</h3>
          <p>Per questa tipologia non ci sono spazi disponibili al momento</p>
        </div>
      ) : (
        <div className="space-select-list">
          {filtered.map((space) => {
            const Icon = TYPE_ICONS[space.type] || Building2;
            const color = TYPE_COLORS[space.type];
            const isSelected = selected?.id === space.id;
            return (
              <div
                key={space.id}
                className={`space-select-item ${isSelected ? "selected" : ""}`}
                onClick={() => onSelect(space)}
              >
                <div
                  className="space-select-icon"
                  style={{ background: `${color}1a` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="space-select-info">
                  <div className="space-select-name">{space.name}</div>
                  <div className="space-select-sub">
                    {SPACE_TYPE_LABELS[space.type]} · Piano {space.floor} ·{" "}
                    {space.capacity} pers. ·{" "}
                    {(space.amenities || []).slice(0, 3).join(", ")}
                  </div>
                </div>
                <div className="space-select-rate">
                  €{space.hourlyRate}
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      color: "var(--text-muted)",
                    }}
                  >
                    /h
                  </span>
                </div>
                {isSelected && (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Check size={13} color="white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step2BookingForm({ form, setForm, errors, space }) {
  const f = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: 4,
          }}
        >
          Dati Prenotazione
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Spazio selezionato:{" "}
          <strong style={{ color: "var(--accent)" }}>{space?.name}</strong> · €
          {space?.hourlyRate}/h
        </div>
      </div>
      <div className="form-grid">
        <div className="form-group full">
          <label className="form-label">Nome Cliente / Azienda *</label>
          <input
            className={`form-input ${errors.customerName ? "error" : ""}`}
            placeholder="es. Mario Rossi / Startup Srl"
            value={form.customerName}
            onChange={(e) => f("customerName", e.target.value)}
          />
          {errors.customerName && (
            <span className="form-error">{errors.customerName}</span>
          )}
        </div>
        <div className="form-group full">
          <label className="form-label">Data Prenotazione *</label>
          <input
            type="date"
            className={`form-input ${errors.date ? "error" : ""}`}
            min={today}
            value={form.date}
            onChange={(e) => f("date", e.target.value)}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Ora Inizio *</label>
          <input
            type="time"
            className={`form-input ${errors.startTime ? "error" : ""}`}
            value={form.startTime}
            onChange={(e) => f("startTime", e.target.value)}
          />
          {errors.startTime && (
            <span className="form-error">{errors.startTime}</span>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Ora Fine *</label>
          <input
            type="time"
            className={`form-input ${errors.endTime ? "error" : ""}`}
            value={form.endTime}
            onChange={(e) => f("endTime", e.target.value)}
          />
          {errors.endTime && (
            <span className="form-error">{errors.endTime}</span>
          )}
        </div>
        <div className="form-group full">
          <label className="form-label">Note aggiuntive</label>
          <textarea
            className="form-input"
            rows={3}
            placeholder="Eventuali richieste speciali, setup sala, ecc."
            value={form.notes}
            onChange={(e) => f("notes", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
      </div>
      {form.startTime &&
        form.endTime &&
        space &&
        (() => {
          const [sh, sm] = form.startTime.split(":").map(Number);
          const [eh, em] = form.endTime.split(":").map(Number);
          const hours = (eh * 60 + em - sh * 60 - sm) / 60;
          if (hours > 0) {
            return (
              <div
                style={{
                  padding: "12px 16px",
                  background: "var(--accent-dim)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.85rem",
                  color: "var(--accent)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>
                  ⏱ Durata: <strong>{hours}h</strong>
                </span>
                <span>
                  Costo stimato:{" "}
                  <strong
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1rem",
                    }}
                  >
                    €{(hours * space.hourlyRate).toFixed(2)}
                  </strong>
                </span>
              </div>
            );
          }
          return null;
        })()}
    </div>
  );
}

function Step3Confirm({ space, form }) {
  const [sh, sm] = form.startTime.split(":").map(Number);
  const [eh, em] = form.endTime.split(":").map(Number);
  const hours = (eh * 60 + em - sh * 60 - sm) / 60;
  const total = (hours * space.hourlyRate).toFixed(2);
  const dateFormatted = new Date(form.date).toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const Icon = TYPE_ICONS[space.type] || Building2;

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.05rem",
            marginBottom: 4,
          }}
        >
          Riepilogo Prenotazione
        </div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          Verifica i dettagli prima di confermare
        </div>
      </div>
      <div className="confirm-card">
        <div className="confirm-header">
          <div className="confirm-icon">
            <Icon size={22} />
          </div>
          <div>
            <div className="confirm-space-name">{space.name}</div>
            <div className="confirm-space-type">
              {SPACE_TYPE_LABELS[space.type]} · Piano {space.floor}
            </div>
          </div>
          <span
            className={`badge badge-${space.type}`}
            style={{ marginLeft: "auto" }}
          >
            {SPACE_TYPE_LABELS[space.type]}
          </span>
        </div>
        <div className="confirm-detail-list">
          <div className="confirm-detail-row">
            <div
              className="confirm-detail-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <User size={14} /> Cliente
            </div>
            <div className="confirm-detail-value">{form.customerName}</div>
          </div>
          <div className="confirm-detail-row">
            <div
              className="confirm-detail-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Calendar size={14} /> Data
            </div>
            <div className="confirm-detail-value">{dateFormatted}</div>
          </div>
          <div className="confirm-detail-row">
            <div
              className="confirm-detail-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Clock size={14} /> Fascia Oraria
            </div>
            <div className="confirm-detail-value">
              {form.startTime} – {form.endTime} ({hours}h)
            </div>
          </div>
          <div className="confirm-detail-row">
            <div className="confirm-detail-label">Tariffa oraria</div>
            <div className="confirm-detail-value">€{space.hourlyRate}/h</div>
          </div>
          {form.notes && (
            <div className="confirm-detail-row">
              <div className="confirm-detail-label">Note</div>
              <div
                className="confirm-detail-value"
                style={{
                  textAlign: "right",
                  maxWidth: "60%",
                  fontSize: "0.82rem",
                }}
              >
                {form.notes}
              </div>
            </div>
          )}
          <div className="confirm-detail-row confirm-total">
            <div className="confirm-detail-label">Totale stimato</div>
            <div className="confirm-detail-value">€{total}</div>
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          color: "var(--text-muted)",
          textAlign: "center",
        }}
      >
        La prenotazione sarà confermata immediatamente. Il cliente riceverà una
        notifica.
      </div>
    </div>
  );
}

export default function BookingSystem() {
  const { spaces, addBooking, bookings } = useApp();
  const [step, setStep] = useState(0);
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [form, setForm] = useState({
    customerName: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const validateStep1 = () => selectedSpace !== null;
  const validateStep2 = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Nome cliente obbligatorio";
    if (!form.date) e.date = "Data obbligatoria";
    if (!form.startTime) e.startTime = "Ora di inizio obbligatoria";
    if (!form.endTime) e.endTime = "Ora di fine obbligatoria";
    if (form.startTime && form.endTime) {
      const [sh, sm] = form.startTime.split(":").map(Number);
      const [eh, em] = form.endTime.split(":").map(Number);
      if (eh * 60 + em <= sh * 60 + sm)
        e.endTime = "L'ora di fine deve essere dopo l'inizio";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    if (step === 2) {
      const [sh, sm] = form.startTime.split(":").map(Number);
      const [eh, em] = form.endTime.split(":").map(Number);
      const hours = (eh * 60 + em - sh * 60 - sm) / 60;
      const newBooking = addBooking({
        spaceId: selectedSpace.id,
        spaceName: selectedSpace.name,
        spaceType: selectedSpace.type,
        customerName: form.customerName,
        date: new Date(form.date).toISOString(),
        startTime: form.startTime,
        endTime: form.endTime,
        hours,
        totalCost: parseFloat((hours * selectedSpace.hourlyRate).toFixed(2)),
        notes: form.notes,
      });
      setSuccess(newBooking);
      setStep(0);
      setSelectedSpace(null);
      setForm({
        customerName: "",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Sistema di Prenotazione</div>
        <div className="page-subtitle">
          Prenota scrivanie, sale riunioni e uffici privati
        </div>
      </div>

      {success && (
        <div className="success-banner">
          <CheckCircle size={20} className="success-banner-icon" />
          <div>
            <div className="success-banner-text">
              ✅ Prenotazione {success.id} confermata con successo!
            </div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--emerald)",
                opacity: 0.8,
                marginTop: 2,
              }}
            >
              {success.customerName} · {success.spaceName} · €
              {success.totalCost}
            </div>
          </div>
          <button
            onClick={() => setSuccess(null)}
            style={{
              marginLeft: "auto",
              color: "var(--emerald)",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Wizard */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📅 Nuova Prenotazione</div>
          </div>
          <div className="card-body">
            <StepsBar current={step} />

            {step === 0 && (
              <Step1SelectSpace
                spaces={spaces}
                selected={selectedSpace}
                onSelect={setSelectedSpace}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
              />
            )}
            {step === 1 && (
              <Step2BookingForm
                form={form}
                setForm={setForm}
                errors={errors}
                space={selectedSpace}
              />
            )}
            {step === 2 && <Step3Confirm space={selectedSpace} form={form} />}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 24,
              }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft size={15} /> Indietro
              </button>
              <button
                className="btn btn-primary"
                onClick={handleNext}
                disabled={step === 0 && !selectedSpace}
              >
                {step === 2 ? (
                  <>
                    <CheckCircle size={15} /> Conferma Prenotazione
                  </>
                ) : (
                  <>
                    Avanti <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Bookings sidebar */}
        <div
          className="card"
          style={{ position: "sticky", top: "calc(var(--topbar-h) + 28px)" }}
        >
          <div className="card-header">
            <div className="card-title">🕐 Prenotazioni Recenti</div>
          </div>
          <div style={{ padding: "8px 0" }}>
            {recentBookings.map((b) => {
              const date = new Date(b.date).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
              });
              return (
                <div
                  key={b.id}
                  style={{
                    padding: "10px 18px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: TYPE_COLORS[b.spaceType] + "1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: TYPE_COLORS[b.spaceType],
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {b.id.replace("BK", "")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {b.customerName}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: 1,
                      }}
                    >
                      {b.spaceName} · {date}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-secondary)",
                        marginTop: 1,
                      }}
                    >
                      {b.startTime}–{b.endTime}
                    </div>
                  </div>
                  <div
                    style={{
                      color: "var(--emerald)",
                      fontWeight: 800,
                      fontFamily: "var(--font-display)",
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    €{b.totalCost}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
