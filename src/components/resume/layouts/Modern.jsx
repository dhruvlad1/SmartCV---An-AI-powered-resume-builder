export default function Modern({ data }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        color: "#111",
        minHeight: "100%",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "30%",
          padding: "16px 12px",
          borderRight: "1px solid #ddd",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h1 style={{ fontSize: "20px", marginBottom: "6px", fontWeight: "bold" }}>
          {data.name}
        </h1>
        <p style={{ marginTop: 0, marginBottom: "8px", fontSize: "11px", color: "#555" }}>
          {data.title}
        </p>

        {/* Contact Info */}
        {(data.email || data.phone || data.location) && (
          <section style={{ marginTop: "12px", marginBottom: "12px" }}>
            <h3 style={sideTitle}>Contact</h3>
            {data.email && <div style={contactItem}>{data.email}</div>}
            {data.phone && <div style={contactItem}>{data.phone}</div>}
            {data.location && <div style={contactItem}>{data.location}</div>}
            {data.linkedin && <div style={contactItem}>{data.linkedin}</div>}
            {data.github && <div style={contactItem}>{data.github}</div>}
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section style={{ marginTop: "12px" }}>
            <h3 style={sideTitle}>Skills</h3>
            <ul style={{ paddingLeft: "16px", marginTop: "4px" }}>
              {data.skills.map((skill, i) => (
                <li key={i} style={{ marginBottom: "4px", fontSize: "11px" }}>
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <section style={{ marginTop: "12px" }}>
            <h3 style={sideTitle}>Certifications</h3>
            {data.certifications.map((cert, i) => (
              <div key={i} style={{ marginBottom: "6px", fontSize: "10px" }}>
                <strong>{cert.name}</strong>
                {cert.year && <div style={{ color: "#666" }}>{cert.year}</div>}
              </div>
            ))}
          </section>
        )}
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div style={{ width: "70%", padding: "16px 12px" }}>
        {/* Summary */}
        {data.summary && (
          <section style={{ marginBottom: "16px" }}>
            <h2 style={mainTitle}>Summary</h2>
            <p style={{ marginTop: "4px", textAlign: "justify", lineHeight: "1.6" }}>
              {data.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2 style={mainTitle}>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div style={{ marginBottom: "4px" }}>
                  <strong style={{ fontSize: "12px" }}>{exp.role}</strong>
                  {exp.company && <span> – {exp.company}</span>}
                  {exp.location && <span>, {exp.location}</span>}
                </div>
                <div style={{ fontSize: "11px", color: "#555", marginBottom: "4px" }}>
                  {exp.year}
                </div>
                {exp.description && Array.isArray(exp.description) && (
                  <ul style={{ margin: "4px 0 0 0", paddingLeft: "20px" }}>
                    {exp.description.map((desc, idx) => (
                      <li key={idx} style={{ marginBottom: "3px", fontSize: "11px", lineHeight: "1.5" }}>
                        {desc}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section style={{ marginBottom: "16px" }}>
            <h2 style={mainTitle}>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} style={{ marginBottom: "8px" }}>
                <div>
                  <strong>{edu.degree}</strong>
                  {edu.institute && <span>, {edu.institute}</span>}
                  {edu.location && <span> — {edu.location}</span>}
                </div>
                <div style={{ fontSize: "11px", color: "#555" }}>
                  {edu.year}
                  {edu.gpa && <span> | GPA: {edu.gpa}</span>}
                  {edu.honors && <span> | {edu.honors}</span>}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <h2 style={mainTitle}>Projects</h2>
            {data.projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: "10px" }}>
                <div>
                  <strong>{proj.name}</strong>
                  {proj.year && <span> ({proj.year})</span>}
                </div>
                {proj.description && (
                  <div style={{ fontSize: "11px", marginTop: "3px", lineHeight: "1.5" }}>
                    {proj.description}
                  </div>
                )}
                {proj.tech && proj.tech.length > 0 && (
                  <div style={{ fontSize: "10px", color: "#666", marginTop: "3px", fontStyle: "italic" }}>
                    {proj.tech.join(" • ")}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

const mainTitle = {
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "6px",
  marginTop: "8px",
  borderBottom: "2px solid #06B6D4",
  paddingBottom: "4px",
  color: "#06B6D4",
};

const sideTitle = {
  fontSize: "13px",
  fontWeight: "bold",
  marginBottom: "6px",
  marginTop: "8px",
  color: "#333",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const contactItem = {
  fontSize: "10px",
  marginBottom: "4px",
  color: "#555",
  wordBreak: "break-word",
};
