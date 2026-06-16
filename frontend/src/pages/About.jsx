import React from "react";

export default function About() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-3">About Kaaj Kormo</h2>
      <p className="text-muted">
        Kaaj Kormo is a platform to help people in Bangladesh find jobs and hire skilled workers easily.
      </p>

      <div className="row g-4 mt-3">
        <div className="col-12 col-md-4">
          <div className="p-4 border rounded-4 h-100">
            <div className="text-primary fs-4 mb-2">
              <i className="bi bi-briefcase"></i>
            </div>
            <h5 className="fw-semibold">Find Jobs</h5>
            <p className="text-muted mb-0">Browse jobs by category, location, and salary.</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-4 border rounded-4 h-100">
            <div className="text-primary fs-4 mb-2">
              <i className="bi bi-person-check"></i>
            </div>
            <h5 className="fw-semibold">Hire Workers</h5>
            <p className="text-muted mb-0">Post jobs and connect with skilled workers quickly.</p>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="p-4 border rounded-4 h-100">
            <div className="text-primary fs-4 mb-2">
              <i className="bi bi-shield-check"></i>
            </div>
            <h5 className="fw-semibold">Trusted System</h5>
            <p className="text-muted mb-0">A simple, clean experience with secure access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
