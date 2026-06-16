import React from "react";

export default function Help() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-2">Help Center</h2>
      <p className="text-muted mb-4">Quick answers to common questions.</p>

      <div className="accordion" id="helpAccordion">
        {[
          {
            q: "How do I apply for a job?",
            a: "Login as a Worker → open Job Details → upload your CV → click Apply.",
          },
          {
            q: "How do companies post jobs?",
            a: "Login as Company → go to Dashboard/Post Job → submit job details.",
          },
          {
            q: "Can I edit my profile?",
            a: "Yes. Go to Profile and update your information (Worker users).",
          },
        ].map((item, idx) => (
          <div className="accordion-item" key={item.q}>
            <h2 className="accordion-header" id={`h${idx}`}>
              <button
                className={`accordion-button ${idx !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#c${idx}`}
              >
                {item.q}
              </button>
            </h2>
            <div
              id={`c${idx}`}
              className={`accordion-collapse collapse ${idx === 0 ? "show" : ""}`}
              data-bs-parent="#helpAccordion"
            >
              <div className="accordion-body text-muted">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
