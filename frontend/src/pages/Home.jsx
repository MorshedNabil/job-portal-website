import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../css/Home.css";

const FALLBACK_IMG = "/default-job.jpg";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs/", { params: { limit: 6, page: 1 } });
        setJobs(data.items || data.results || []);
      } catch (err) {
        console.log("Home fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="page-wrap">
      {/* HERO */}
      <section className="hero-section">
        <div className="container-xl">
          <div className="hero-inner">
            {/* Left: text */}
            <div className="hero-text">
              <span className="hero-eyebrow">JOB PORTAL</span>
              <h1 className="hero-heading">
                Welcome to<br />
                <span className="hero-brand">Kaj Kormo</span>
              </h1>
              <p className="hero-sub">
                Find your next opportunity or hire<br className="d-none d-lg-block" />
                the right person — all in one place.
              </p>
              <Link to="/register" className="hero-cta">Get Started →</Link>
            </div>

            {/* Right: floating visuals */}
            <div className="hero-visual">
              {/* Filled circles */}
              <div className="hcircle hcircle-xl" />
              <div className="hcircle hcircle-lg" />
              <div className="hcircle hcircle-md" />
              <div className="hcircle hcircle-sm" />
              <div className="hcircle hcircle-xs" />
              {/* Outline circles */}
              <div className="hcircle hcircle-outline-lg" />
              <div className="hcircle hcircle-outline-sm" />

              <div className="hero-badge">
                <strong>2,400+</strong>
                <span>Jobs Available</span>
              </div>

              <div className="hero-card">
                <div className="hero-card-top">
                  <span className="hero-card-icon">
                    <i className="fa-solid fa-check" />
                  </span>
                  <div>
                    <div className="hero-card-title">Software Engineer</div>
                    <div className="hero-card-meta">Dhaka · Full-time</div>
                  </div>
                </div>
                <div className="hero-card-actions">
                  <span className="hca-apply">Apply Now</span>
                  <span className="hca-salary">৳ 50k</span>
                </div>
              </div>

              <div className="hero-float-icon">
                <i className="fa-solid fa-briefcase" />
              </div>

              {/* Pink pin icon */}
              <div className="hero-pin">
                <i className="fa-solid fa-location-dot" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="container my-4">
        <div className="row g-3">
          {[
            { t: "10k+ Jobs", d: "Available listings", icon: "fa-briefcase" },
            { t: "Fast Apply", d: "1 click apply", icon: "fa-bolt" },
            { t: "Bangladesh", d: "All major cities", icon: "fa-location-dot" },
          ].map((x) => (
            <div className="col-12 col-md-4" key={x.t}>
              <div className="p-4 border rounded-4 shadow-sm h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon">
                    <i className={`fa-solid ${x.icon}`}></i>
                  </div>
                  <div>
                    <div className="fw-bold">{x.t}</div>
                    <div className="text-muted small">{x.d}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="container my-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="m-0 fw-bold">
            <i className="fa-solid fa-bolt me-2 text-primary"></i>Latest Jobs
          </h3>
          <Link to="/jobs" className="btn btn-sm btn-outline-primary">View All</Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-5">No jobs posted yet.</div>
        ) : (
          <div className="row g-4">
            {jobs.map((job) => (
              <div key={job.id || job._id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm job-card">
                  <img
                    src={job.image_url || FALLBACK_IMG}
                    className="card-img-top job-img"
                    alt={job.title}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-semibold mb-1 text-truncate">{job.title || "Untitled Job"}</h5>
                    <p className="text-muted small mb-3 job-desc">
                      {(job.description || "").slice(0, 120)}
                      {(job.description || "").length > 120 ? "..." : ""}
                    </p>
                    <div className="small mb-2">
                      <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                      <b>Location:</b> {job.location || "N/A"}
                    </div>
                    <div className="small mb-4">
                      <i className="fa-solid fa-sack-dollar me-2 text-primary"></i>
                      <b>Salary:</b> {job.salary || "Negotiable"}
                    </div>
                    <Link to={`/jobs/${job.id || job._id}`} className="btn btn-primary w-100 mt-auto">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section className="container my-5">
        <h4 className="fw-bold mb-3">How it works</h4>
        <div className="row g-4">
          {[
            { t: "Create Account", d: "Register as Worker or Employer.", icon: "fa-user-plus" },
            { t: "Post / Apply", d: "Employers post jobs, workers apply.", icon: "fa-pen-to-square" },
            { t: "Hire & Complete", d: "Confirm and finish work smoothly.", icon: "fa-circle-check" },
          ].map((x) => (
            <div className="col-12 col-md-4" key={x.t}>
              <div className="p-4 border rounded-4 shadow-sm h-100">
                <div className="mb-2 text-primary fs-4">
                  <i className={`fa-solid ${x.icon}`}></i>
                </div>
                <div className="fw-bold">{x.t}</div>
                <div className="text-muted">{x.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container my-5">
        <div className="cta-box p-5 rounded-4 text-white shadow-sm">
          <div className="row align-items-center g-3">
            <div className="col-12 col-lg-8">
              <h4 className="fw-bold mb-2">Ready to hire or find a job?</h4>
              <p className="mb-0 opacity-75">Post a job or browse workers now.</p>
            </div>
            <div className="col-12 col-lg-4 text-lg-end">
              <Link className="btn btn-light fw-bold me-2" to="/register">Get Started</Link>
              <Link className="btn btn-outline-light fw-bold" to="/jobs">Browse Jobs</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
