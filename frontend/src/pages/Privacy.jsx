import React from "react";

export default function Privacy() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-3">Privacy Policy</h2>
      <p className="text-muted">
        This is a demo Privacy Policy page. Later you can replace it with your real policy text.
      </p>

      <div className="p-4 border rounded-4">
        <h6 className="fw-semibold">What we collect</h6>
        <p className="text-muted mb-3">
          Basic account information and job-related data to run the platform.
        </p>

        <h6 className="fw-semibold">How we use it</h6>
        <p className="text-muted mb-3">
          To authenticate users, show job listings, and allow workers to apply to jobs.
        </p>

        <h6 className="fw-semibold mb-0">Contact</h6>
        <p className="text-muted mb-0">For privacy questions: support@kaajkormo.com (demo)</p>
      </div>
    </div>
  );
}
