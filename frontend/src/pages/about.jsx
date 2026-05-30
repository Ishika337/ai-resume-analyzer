function About() {
  return (
    <div style={{ minHeight: "90vh", background: "#020617", color: "white", padding: "60px" }}>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <h1 style={{ fontSize: "45px", color: "#38bdf8", marginBottom: "25px" }}>About Project</h1>
        <p style={{ fontSize: "18px", lineHeight: "1.8", color: "#cbd5e1" }}>
          AI Career Copilot is a next-generation resume intelligence platform. We use advanced 
          AI to break down your resume against specific job descriptions, giving you the 
          exact roadmap to land your dream role.
        </p>
        <div style={{ marginTop: "40px", padding: "30px", background: "#1e293b", borderRadius: "15px" }}>
          <h3 style={{ color: "#38bdf8" }}>Our Mission</h3>
          <p style={{ color: "#94a3b8" }}>To bridge the gap between talented candidates and complex Applicant Tracking Systems (ATS).</p>
        </div>
      </div>
    </div>
  );
}

export default About;