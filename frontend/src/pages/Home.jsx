import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import "../css/Home.css";

const FALLBACK_IMG = "https://picsum.photos/seed/kaajkormo/800/520";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const slides = useMemo(() => [
    {
      title: "Welcome to Kaaj Kormo",
      subtitle: "Find jobs or hire skilled workers easily across Bangladesh.",
      img: "/images/hero/slide-1.jpg",
      ctaText: "Browse Jobs",
      ctaLink: "/jobs",
    },
    {
      title: "Hire Skilled Workers Fast",
      subtitle: "Post a job and get applications quickly.",
      img: "/images/hero/slide-2.jpg",
      ctaText: "Post a Job",
      ctaLink: "/register",
    },
    {
      title: "Trusted Local Services",
      subtitle: "Driver, Cleaner, Electrician, Plumber—everything in one place.",
      img: "/images/hero/slide-3.jpg",
      ctaText: "Explore Categories",
      ctaLink: "/jobs",
    },
  ], []);

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
      {/* HERO SLIDER */}
      <section className="container my-4">
        <div
          id="homeHero"
          className="carousel slide hero-carousel shadow-sm"
          data-bs-ride="carousel"
          data-bs-interval="3500"
        >
          <div className="carousel-indicators">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#homeHero"
                data-bs-slide-to={i}
                className={i === 0 ? "active" : ""}
                aria-current={i === 0 ? "true" : "false"}
              />
            ))}
          </div>

          <div className="carousel-inner rounded-4 overflow-hidden">
            {slides.map((s, i) => (
              <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={s.title}>
                <div
                  className="hero-slide d-flex align-items-center"
                  style={{
                    backgroundImage: `linear-gradient(120deg, rgba(2,6,23,.70), rgba(37,99,235,.45)), url(${s.img})`,
                  }}
                >
                  <div className="container py-5">
                    <div className="text-white" style={{ maxWidth: 720 }}>
                      <h1 className="fw-bold display-5 mb-2">{s.title}</h1>
                      <p className="mb-4 opacity-75">{s.subtitle}</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <Link to={s.ctaLink} className="btn btn-light fw-bold px-4">
                          {s.ctaText}
                        </Link>
                        <Link to="/login" className="btn btn-outline-light fw-bold px-4">
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#homeHero" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#homeHero" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
          </button>
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
                    src={job.imageUrl || FALLBACK_IMG}
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
