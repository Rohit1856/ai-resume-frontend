export default function Header({ activeView, onSwitchView }) {
  const tabs = ["Dashboard", "Analyzer", "Builder"];

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow"></p>
        <h1>AI-Powered Resume Analyzer & Builder System</h1>
      </div>
      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeView === tab ? "tab active" : "tab"}
            onClick={() => onSwitchView(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}