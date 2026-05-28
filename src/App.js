import React, { useState, createContext, useContext } from "react";
import { initialSpaces, initialBookings } from "./data";
import Layout from "./components/Layout";
import DashboardHome from "./components/DashboardHome";
import SpacesManager from "./components/SpacesManager";
import BookingSystem from "./components/BookingSystem";
import ReportsDashboard from "./components/ReportsDashboard";
import "./styles.css";

export const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [spaces, setSpaces] = useState(initialSpaces);
  const [bookings, setBookings] = useState(initialBookings);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const addSpace = (space) => {
    const newSpace = { ...space, id: Date.now(), status: "available" };
    setSpaces((prev) => [...prev, newSpace]);
    return newSpace;
  };

  const updateSpaceStatus = (id, status) => {
    setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const deleteSpace = (id) => {
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  const addBooking = (booking) => {
    const newBooking = {
      ...booking,
      id: `BK${String(bookings.length + 1).padStart(3, "0")}`,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const cancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)),
    );
  };

  const contextValue = {
    currentPage,
    setCurrentPage,
    spaces,
    addSpace,
    updateSpaceStatus,
    deleteSpace,
    bookings,
    addBooking,
    cancelBooking,
    sidebarOpen,
    setSidebarOpen,
  };

  const pages = {
    home: DashboardHome,
    spaces: SpacesManager,
    booking: BookingSystem,
    reports: ReportsDashboard,
  };
  const PageComponent = pages[currentPage] || DashboardHome;

  return (
    <AppContext.Provider value={contextValue}>
      <Layout>
        <PageComponent />
      </Layout>
    </AppContext.Provider>
  );
}
