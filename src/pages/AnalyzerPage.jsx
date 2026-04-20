import { useState } from "react";
import CategoryBars from "../components/CategoryBars";
import ScoreRing from "../components/ScoreRing";
import { analyzeResume, atsCheck } from "../services/api";

const initialResult = null;

export default function AnalyzerPage() {
  const [formState, setFormState] = useState({
    targetRole: "AI Engineer",
    jobDescription: "",
    resume: null,
  });
  const [analysis, setAnalysis] = useState(initialResult);
  const [ats, setAts] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.resume) return;

    const buildPayload = () => {
      const formData = new FormData();
      formData.append("resume", formState.resume);
      formData.append("targetRole", formState.targetRole);
      formData.append("jobDescription", formState.jobDescription);
      return formData;
    };

    setLoading(true);
    try {
      const [analysisResponse, atsResponse] = await Promise.all([
        analyzeResume(buildPayload()),
        atsCheck(buildPayload()),
      ]);
      setAnalysis(analysisResponse);
      setAts(atsResponse);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="analyzer-layout">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Resume Intelligence</p>
            <h3>Analyze resume strength and ATS fit</h3>
          </div>
        </div>

        <form className="analyzer-form" onSubmit={handleSubmit}>
          <label>
            Target Role
            <input
              value={formState.targetRole}
              onChange={(event) => setFormState({ ...formState, targetRole: event.target.value })}
              placeholder="AI Engineer"
            />
          </label>
          <label>
            Job Description
            <textarea
              rows="7"
              value={formState.jobDescription}
              onChange={(event) => setFormState({ ...formState, jobDescription: event.target.value })}
              placeholder="Paste a job description to calculate ATS score and missing keywords."
            />
          </label>
          <label className="upload-box">
            Upload Resume (PDF/DOCX/TXT)
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(event) => setFormState({ ...formState, resume: event.target.files?.[0] || null })}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </form>
      </div>

      {analysis ? (
        <div className="results-grid">
          <div className="panel ring-panel">
            <ScoreRing value={analysis.overall_score} label="Overall Resume Score" />
            <ScoreRing value={ats?.ats_score || 0} label="ATS Compatibility" />
          </div>

          <div className="panel">
            <div className="section-heading">
              <h3>Category Breakdown</h3>
            </div>
            <CategoryBars scores={analysis.category_scores} />
          </div>

          <div className="panel">
            <div className="section-heading">
              <h3>Detected Skills</h3>
            </div>
            <div className="chip-wrap">
              {analysis.skills_found.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-heading">
              <h3>Missing Keywords</h3>
            </div>
            <div className="chip-wrap">
              {(ats?.missing_keywords || []).map((keyword) => (
                <span key={keyword} className="chip danger">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="section-heading">
              <h3>Smart Suggestions</h3>
            </div>
            <ul className="insight-list">
              {analysis.smart_suggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <div className="section-heading">
              <h3>Recommended Roles</h3>
            </div>
            <div className="job-match-grid">
              {analysis.job_matches.map((job) => (
                <article key={job.role} className="job-card">
                  <strong>{job.role}</strong>
                  <span>{job.match_strength}% match</span>
                  <p>{job.suggested_titles.join(" | ")}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}