import React from "react";

export default function Careers() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-2">Careers</h2>
      <p className="text-muted mb-4">We're building Kaaj Kormo for Bangladesh. Join us!</p>

      <div className="row g-4">
        {[
          { role: "Frontend Developer (React)", type: "Remote", level: "Junior" },
          { role: "Backend Developer (Node.js)", type: "Hybrid", level: "Mid" },
          { role: "UI/UX Designer", type: "Remote", level: "Junior" },
        ].map((x) => (
          <div className="col-12 col-md-6 col-lg-4" key={x.role}>
            <div className="p-4 border rounded-4 h-100">
              <h5 className="fw-semibold">{x.role}</h5>
              <div className="text-muted small mb-3">
                <i className="bi bi-geo me-2"></i>{x.type}{" "}
                <span className="mx-2">•</span>
                <i className="bi bi-award me-2"></i>{x.level}
              </div>
              <p className="text-muted mb-3">
                Work on real-world features like job posting, profiles, and dashboards.
              </p>
              <button className="btn btn-outline-primary">Apply (demo)</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
