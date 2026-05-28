# 🏢 CoWork Hub Dashboard

Dashboard professionale per la gestione di spazi co-working.

## Stack Tecnologico

- **React 18** – Framework UI
- **Recharts** – Grafici interattivi (torta, barre, linee)
- **Lucide React** – Icone
- **CSS Custom** – Design system con variabili CSS (no framework esterno)
- **Google Fonts** – Syne (display) + DM Sans (body)

## Funzionalità

### 🏠 Panoramica
- KPI cards: spazi disponibili, prenotazioni attive, fatturato, totale spazi
- Barra di avanzamento occupazione per tipologia
- Azioni rapide
- Elenco prenotazioni recenti

### 🏢 Gestione Spazi
- Vista griglia e tabella (toggle)
- Filtri per tipologia (scrivania, sala, ufficio) e stato
- Ricerca per nome
- Form aggiunta nuovo spazio con validazione
- Cambio stato: Disponibile ↔ Manutenzione
- Eliminazione spazio

### 📅 Sistema di Prenotazione (wizard 3 step)
1. **Selezione spazio** – Lista filtrabile degli spazi disponibili
2. **Dati prenotazione** – Cliente, data, fascia oraria con calcolo automatico costo
3. **Conferma** – Riepilogo completo con tariffa stimata

### 📊 Reportistica
- **Grafico torta** – Distribuzione tipologie spazi
- **Grafico barre** – Spazi più prenotati
- **Grafico linee** – Andamento fatturato ultimi 20 giorni
- **Grafico barre raggruppato** – Confronto settimanale
- **Tabella cronologica** – Con filtri e ricerca, toggle prenotazioni annullate
- KPI: fatturato totale, prenotazioni, ore prenotate, valore medio

## Setup & Avvio

```bash
# Installa dipendenze
npm install

# Avvia in development
npm start

# Build per produzione
npm run build
```

Apri [http://localhost:3000](http://localhost:3000)

## Struttura

```
src/
├── App.js                    # Root + Context globale
├── data.js                   # Dati hardcoded (spazi + prenotazioni)
├── styles.css                # Design system completo
├── index.js                  # Entry point React
└── components/
    ├── Layout.js             # Shell: Sidebar + Topbar
    ├── DashboardHome.js      # Pagina Panoramica
    ├── SpacesManager.js      # Gestione Spazi
    ├── BookingSystem.js      # Wizard Prenotazione
    └── ReportsDashboard.js   # Analytics & Report
```

## Design

- **Tema**: Dark mode professionale
- **Palette**: Deep navy + Electric blue accent + Emerald + Violet
- **Font**: Syne (display/titoli) + DM Sans (body)
- **Responsive**: Desktop, tablet, mobile con sidebar collassabile
