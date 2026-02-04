export default function JakesClassic({ data }) {
  return (
    <div style={{ background: "white", padding: "1rem" }}>
      
      {/* Header */}
      <h1>{data.name}</h1>
      <p>{data.title}</p>

      {/* Summary */}
      <section>
        <h2>Summary</h2>
        <p>{data.summary}</p>
      </section>

      {/* Experience */}
      <section>
        <h2>Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i}>
            <strong>{exp.role}</strong> - {exp.company}
            <p>{exp.year}</p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section>
        <h2>Education</h2>
        {data.education.map((edu, i) => (
          <p key={i}>
            {edu.degree}, {edu.institute}
          </p>
        ))}
      </section>

      {/* Skills */}
      <section>
        <h2>Skills</h2>
        <p>{data.skills.join(", ")}</p>
      </section>

    </div>
  );
}
