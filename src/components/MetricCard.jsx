export default function MetricCard({ label, value, tone = "default", helper }) {
  return (
    <article className={`metric-card ${tone}`}>
      <p>{label}</p>
      <h3>{value}</h3>
      {helper ? <span>{helper}</span> : null}
    </article>
  );
}