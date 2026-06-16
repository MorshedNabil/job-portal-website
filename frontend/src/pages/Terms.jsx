import React from "react";

export default function Terms() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-3">Terms &amp; Conditions</h2>
      <p className="text-muted">
        This is a demo Terms page. Replace it with your real Terms later.
      </p>

      <div className="p-4 border rounded-4">
        <h6 className="fw-semibold">User Responsibility</h6>
        <p className="text-muted mb-3">
          Users must provide accurate information and use the platform respectfully.
        </p>

        <h6 className="fw-semibold">Job Posting</h6>
        <p className="text-muted mb-3">
          Companies are responsible for job details, salary, and hiring process.
        </p>

        <h6 className="fw-semibold mb-0">Disclaimer</h6>
        <p className="text-muted mb-0">
          Kaaj Kormo is a job platform and does not guarantee hiring results.
        </p>
      </div>
    </div>
  );
}
