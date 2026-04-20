export default function CategoryBars({ scores = {} }) {
  return (
    <div className="category-bars">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key} className="bar-row">
          <div className="bar-label">
            <span>{key.replaceAll("_", " ")}</span>
            <strong>{value}</strong>
          </div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}