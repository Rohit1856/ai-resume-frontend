export default function ResumePreview({ data, template = "executive" }) {
  const skills = data.skills?.filter(Boolean) || [];
  const experience = data.experience?.filter((item) => item.title || item.company || item.highlights) || [];
  const education = data.education?.filter((item) => item.degree || item.institution) || [];

  return (
    <section className={`resume-preview ${template}`} id="resume-preview">
      <header className="resume-header">
        <div>
          <h2>{data.fullName || "Your Name"}</h2>
          <p>{data.summary || "Professional summary will appear here."}</p>
        </div>
        <div className="resume-contact">
          <span>{data.email || "email@example.com"}</span>
          <span>{data.phone || "+91 XXXXX XXXXX"}</span>
          <span>{data.city || "City"}</span>
        </div>
      </header>

      <div className="resume-grid">
        <aside>
          <div className="resume-section">
            <h3>Skills</h3>
            <ul className="pill-list">
              {skills.length ? skills.map((skill) => <li key={skill}>{skill}</li>) : <li>React</li>}
            </ul>
          </div>
          <div className="resume-section">
            <h3>Education</h3>
            {education.map((item, index) => (
              <article key={`${item.degree}-${index}`} className="timeline-item">
                <strong>{item.degree}</strong>
                <p>{item.institution}</p>
                <span>{item.year}</span>
              </article>
            ))}
          </div>
        </aside>

        <main>
          <div className="resume-section">
            <h3>Experience</h3>
            {experience.map((item, index) => (
              <article key={`${item.title}-${index}`} className="timeline-item">
                <strong>{item.title}</strong>
                <p>{item.company}</p>
                <span>{item.duration}</span>
                <p>{item.highlights}</p>
              </article>
            ))}
          </div>
          <div className="resume-section">
            <h3>Projects & Achievements</h3>
            <p>{data.projects || "List impactful projects with metrics, tools, and deployment outcomes."}</p>
          </div>
        </main>
      </div>
    </section>
  );
}