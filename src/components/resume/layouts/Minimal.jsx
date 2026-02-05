export default function Minimal({ data }) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        lineHeight: "1.5",
        color: "#000",
        padding: "0 4px",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: "12px" }}>
        <strong style={{ fontSize: "16px", fontWeight: "bold" }}>{data.name}</strong>
        <div style={{ fontSize: "11px", marginTop: "2px" }}>{data.title}</div>
        {(data.email || data.phone || data.location) && (
          <div style={{ fontSize: "10px", color: "#333", marginTop: "4px" }}>
            {data.email && <span>{data.email}</span>}
            {data.email && data.phone && <span> • </span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && (data.email || data.phone) && <span> • </span>}
            {data.location && <span>{data.location}</span>}
          </div>
        )}
      </div>

      {/* SUMMARY */}
      {data.summary && (
        <section style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            SUMMARY
          </strong>
          <p style={{ margin: "4px 0", textAlign: "justify" }}>{data.summary}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            EXPERIENCE
          </strong>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginTop: "6px" }}>
              <div style={{ marginBottom: "2px" }}>
                <strong>{exp.role}</strong>
                {exp.company && <span>, {exp.company}</span>}
                {exp.location && <span> — {exp.location}</span>}
                {exp.year && <span> ({exp.year})</span>}
              </div>
              {exp.description && Array.isArray(exp.description) && (
                <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px" }}>
                  {exp.description.map((desc, idx) => (
                    <li key={idx} style={{ marginBottom: "2px", fontSize: "10px" }}>
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
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            EDUCATION
          </strong>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginTop: "4px" }}>
              <div>
                <strong>{edu.degree}</strong>
                {edu.institute && <span>, {edu.institute}</span>}
                {edu.location && <span> — {edu.location}</span>}
              </div>
              <div style={{ fontSize: "10px", color: "#555" }}>
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
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            SKILLS
          </strong>
          <p style={{ margin: "4px 0" }}>{data.skills.join(", ")}</p>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            PROJECTS
          </strong>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginTop: "4px" }}>
              <div>
                <strong>{proj.name}</strong>
                {proj.year && <span> ({proj.year})</span>}
              </div>
              {proj.description && (
                <div style={{ fontSize: "10px", marginTop: "2px" }}>
                  {proj.description}
                </div>
              )}
              {proj.tech && proj.tech.length > 0 && (
                <div style={{ fontSize: "9px", color: "#666", marginTop: "2px", fontStyle: "italic" }}>
                  {proj.tech.join(", ")}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <strong style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            CERTIFICATIONS
          </strong>
          {data.certifications.map((cert, i) => (
            <div key={i} style={{ marginTop: "4px" }}>
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
