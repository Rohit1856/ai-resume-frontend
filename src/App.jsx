import { useState } from "react";
import Header from "./components/Header";
import AnalyzerPage from "./pages/AnalyzerPage";
import BuilderPage from "./pages/BuilderPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [activeView, setActiveView] = useState("Dashboard");

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />
      <Header activeView={activeView} onSwitchView={setActiveView} />

      {activeView === "Dashboard" ? <DashboardPage /> : null}
      {activeView === "Analyzer" ? <AnalyzerPage /> : null}
      {activeView === "Builder" ? <BuilderPage /> : null}
    </div>
  );
}