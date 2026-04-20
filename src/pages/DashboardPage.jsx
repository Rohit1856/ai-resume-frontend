import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import MetricCard from "../components/MetricCard";
import { fetchDashboardSummary } from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    averageScore: 0,
    averageAts: 0,
    totalAnalyses: 0,
    recentAnalyses: [],
  });

  useEffect(() => {
    fetchDashboardSummary().then(setSummary).catch(() => null);
  }, []);

  return (
    <section className="dashboard-layout">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">Recruiter-style intelligence</p>
          <h2>Upload, score, optimize, and rebuild resumes with ATS-focused analytics.</h2>
          <p className="subtle">
            This project combines NLP-based parsing, keyword intelligence, template-based resume building,
            and role recommendations in one workflow.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard label="Average Resume Score" value={summary.averageScore} tone="primary" helper="Across recent analyses" />
        <MetricCard label="Average ATS Score" value={summary.averageAts} tone="secondary" helper="Keyword compatibility" />
        <MetricCard label="Total Analyses" value={summary.totalAnalyses} helper="Saved in project database" />
      </div>

      <div className="panel chart-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Analytics</p>
            <h3>Recent resume performance</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={summary.recentAnalyses}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fd1c5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4fd1c5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="candidateName" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Area type="monotone" dataKey="overallScore" stroke="#4fd1c5" fillOpacity={1} fill="url(#scoreFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}