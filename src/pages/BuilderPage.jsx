import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ResumePreview from "../components/ResumePreview";
import { fetchBuilderSuggestions, prefillResumeBuilder, saveResumeProfile } from "../services/api";

const defaultState = {
  fullName: "",
  email: "",
  phone: "",
  city: "",
  targetRole: "Full Stack Developer",
  summary: "",
  projects: "",
  skills: ["React", "Node.js", "Python"],
  experience: [{ title: "", company: "", duration: "", highlights: "" }],
  education: [{ degree: "", institution: "", year: "" }],
  template: "executive",
};

export default function BuilderPage() {
  const [formData, setFormData] = useState(defaultState);
  const [aiHints, setAiHints] = useState(null);
  const [status, setStatus] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    fetchBuilderSuggestions(formData.targetRole).then(setAiHints).catch(() => null);
  }, [formData.targetRole]);

  const updateExperience = (index, key, value) => {
    const next = [...formData.experience];
    next[index] = { ...next[index], [key]: value };
    setFormData({ ...formData, experience: next });
  };

  const updateEducation = (index, key, value) => {
    const next = [...formData.education];
    next[index] = { ...next[index], [key]: value };
    setFormData({ ...formData, education: next });
  };

  const downloadPdf = async () => {
    const node = document.getElementById("resume-preview");
    if (!node) return;
    const canvas = await html2canvas(node, { scale: 2 });
    const image = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.fullName || "resume"}.pdf`);
  };

  const handleSave = async () => {
    await saveResumeProfile(formData);
    setStatus("Resume profile saved to the project database.");
  };

  const handleImportResume = async () => {
    if (!resumeFile) {
      setStatus("Upload a resume file first to auto-fill the builder.");
      return;
    }

    const payload = new FormData();
    payload.append("resume", resumeFile);
    payload.append("targetRole", formData.targetRole);

    setImporting(true);
    setStatus("");
    try {
      const imported = await prefillResumeBuilder(payload);
      setFormData((current) => ({
        ...current,
        ...imported,
        targetRole: current.targetRole || imported.targetRole,
      }));
      setStatus("Builder auto-filled from uploaded resume and converted into an ATS-friendly draft.");
    } catch (error) {
      setStatus("Failed to import resume into builder.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <section className="builder-layout">
      <div className="builder-form-column">
        <div className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ATS Builder</p>
              <h3>Create a recruiter-ready resume</h3>
            </div>
          </div>

          <div className="builder-form">
            <label className="upload-box">
              Import Existing Resume
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
              />
            </label>

            <button className="ghost-button" type="button" onClick={handleImportResume} disabled={importing}>
              {importing ? "Importing..." : "Auto-Fill From Resume"}
            </button>

            <label>
              Full Name
              <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
            </label>

            <label>
              Email
              <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </label>

            <label>
              Phone
              <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </label>

            <label>
              City
              <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </label>

            <label>
              Target Role
              <input value={formData.targetRole} onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })} />
            </label>

            <label>
              Template
              <select value={formData.template} onChange={(e) => setFormData({ ...formData, template: e.target.value })}>
                <option value="executive">Executive</option>
                <option value="neo">Neo Professional</option>
                <option value="minimal">Minimal ATS</option>
              </select>
            </label>

            <label>
              Professional Summary
              <textarea rows="4" value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
            </label>

            <label>
              Skills (comma separated)
              <input
                value={formData.skills.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map((item) => item.trim()).filter(Boolean),
                  })
                }
              />
            </label>

            <label>
              Projects / Achievements
              <textarea rows="5" value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: e.target.value })} />
            </label>

            <div className="inline-grid">
              <input placeholder="Experience Title" value={formData.experience[0].title} onChange={(e) => updateExperience(0, "title", e.target.value)} />
              <input placeholder="Company" value={formData.experience[0].company} onChange={(e) => updateExperience(0, "company", e.target.value)} />
              <input placeholder="Duration" value={formData.experience[0].duration} onChange={(e) => updateExperience(0, "duration", e.target.value)} />
            </div>

            <textarea
              rows="4"
              placeholder="Impact highlights"
              value={formData.experience[0].highlights}
              onChange={(e) => updateExperience(0, "highlights", e.target.value)}
            />

            <div className="inline-grid">
              <input placeholder="Degree" value={formData.education[0].degree} onChange={(e) => updateEducation(0, "degree", e.target.value)} />
              <input placeholder="Institution" value={formData.education[0].institution} onChange={(e) => updateEducation(0, "institution", e.target.value)} />
              <input placeholder="Year" value={formData.education[0].year} onChange={(e) => updateEducation(0, "year", e.target.value)} />
            </div>

            <div className="action-row">
              <button className="primary-button" type="button" onClick={downloadPdf}>
                Download PDF
              </button>
              <button className="ghost-button" type="button" onClick={handleSave}>
                Save Profile
              </button>
            </div>

            {status ? <p className="status-text">{status}</p> : null}
          </div>
        </div>

        {aiHints ? (
          <div className="panel">
            <div className="section-heading">
              <h3>AI Content Guidance</h3>
            </div>
            <p className="subtle">{aiHints.summary_hint}</p>
            <div className="chip-wrap">
              {aiHints.recommended_skills.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
            <ul className="insight-list">
              {aiHints.achievement_tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="builder-preview-column">
        <ResumePreview data={formData} template={formData.template} />
      </div>
    </section>
  );
}
