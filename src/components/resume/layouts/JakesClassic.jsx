export default function JakesClassic({ data }) {
  return (
    <div
      style={{
        fontFamily: "Times New Roman, serif",
        fontSize: "12px",
        lineHeight: "1.5",
        color: "#000",
        padding: "0 4px",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h1 style={{ fontSize: "22px", margin: "0 0 4px 0", fontWeight: "bold" }}>
          {data.name}
        </h1>
        <div style={{ fontSize: "11px", marginBottom: "2px" }}>
          {data.title}
        </div>
        {(data.email || data.phone || data.location) && (
          <div style={{ fontSize: "10px", color: "#333", marginTop: "2px" }}>
            {data.email && <span>{data.email}</span>}
            {data.email && data.phone && <span> | </span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && (data.email || data.phone) && <span> | </span>}
            {data.location && <span>{data.location}</span>}
          </div>
        )}
        {(data.linkedin || data.github) && (
          <div style={{ fontSize: "10px", color: "#333", marginTop: "2px" }}>
            {data.linkedin && <span>{data.linkedin}</span>}
            {data.linkedin && data.github && <span> | </span>}
            {data.github && <span>{data.github}</span>}
          </div>
        )}
      </div>

      <hr style={{ border: "0.5px solid black", margin: "8px 0" }} />

      {/* SUMMARY */}
      {data.summary && (
        <section style={{ marginBottom: "10px" }}>
          <h2 style={sectionTitle}>Summary</h2>
          <p style={{ margin: "4px 0", textAlign: "justify" }}>{data.summary}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <h2 style={sectionTitle}>Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: "8px" }}>
              <div style={{ marginBottom: "2px" }}>
                <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                {exp.company && <span>, {exp.company}</span>}
                {exp.location && <span> — {exp.location}</span>}
              </div>
              <div style={{ fontStyle: "italic", fontSize: "11px", marginBottom: "4px" }}>
                {exp.year}
              </div>
              {exp.description && Array.isArray(exp.description) && (
                <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px" }}>
                  {exp.description.map((desc, idx) => (
                    <li key={idx} style={{ marginBottom: "2px", fontSize: "11px" }}>
                      {desc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <h2 style={sectionTitle}>Education</h2>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <div>
                <strong>{edu.degree}</strong>
                {edu.institute && <span>, {edu.institute}</span>}
                {edu.location && <span> — {edu.location}</span>}
              </div>
              <div style={{ fontSize: "11px", fontStyle: "italic" }}>
                {edu.year}
                {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                {edu.honors && <span> | {edu.honors}</span>}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <h2 style={sectionTitle}>Skills</h2>
          <p style={{ margin: "4px 0" }}>{data.skills.join(", ")}</p>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <h2 style={sectionTitle}>Projects</h2>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <div>
                <strong>{proj.name}</strong>
                {proj.year && <span> ({proj.year})</span>}
              </div>
              {proj.description && (
                <div style={{ fontSize: "11px", marginTop: "2px" }}>
                  {proj.description}
                </div>
              )}
              {proj.tech && proj.tech.length > 0 && (
                <div style={{ fontSize: "10px", fontStyle: "italic", marginTop: "2px" }}>
                  Technologies: {proj.tech.join(", ")}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 style={sectionTitle}>Certifications</h2>
          {data.certifications.map((cert, i) => (
            <div key={i} style={{ marginBottom: "4px" }}>
              <strong>{cert.name}</strong>
              {cert.issuer && <span>, {cert.issuer}</span>}
              {cert.year && <span> ({cert.year})</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

const sectionTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "4px",
  marginTop: "8px",
  borderBottom: "1px solid black",
  paddingBottom: "2px",
};