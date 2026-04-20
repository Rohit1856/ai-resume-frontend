export default function ScoreRing({ value, label }) {
  const safeValue = Math.max(0, Math.min(100, value || 0));
  const degrees = (safeValue / 100) * 360;

  return (
    <div className="score-ring-card">
      <div
        className="score-ring"
        style={{
          background: `conic-gradient(var(--accent) ${degrees}deg, rgba(255,255,255,0.08) ${degrees}deg)`,
        }}
      >
        <div className="score-ring-inner">
          <strong>{safeValue}</strong>
          <span>/ 100</span>
        </div>
      </div>
      <p>{label}</p>
    </div>
  );
}