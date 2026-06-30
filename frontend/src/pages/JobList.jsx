import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/JobList.css";
import { Link } from "react-router-dom";

const FALLBACK_IMG = "/default-job.jpg";

export default function JobList() {
  const user = useSelector((s) => s.auth.user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get("/jobs/", { params: { q, location, page, limit } });
      const items = data.items || data.results || [];
      setJobs(items);
      setTotalPages(data.totalPages || Math.ceil((data.count || items.length) / limit) || 1);
      setTotal(data.total || data.count || items.length);
    } catch (err) {
      const msg = err.response
        ? `Server error ${err.response.status}: ${err.response.data?.message || err.response.statusText}`
        : `Cannot reach server — is the backend running at ${api.defaults.baseURL}?`;
      setError(msg);
      setJobs([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [q, location, page, limit]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);
  useEffect(() => { setPage(1); }, [q, location]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold">Jobs</h4>
          <small className="text-muted fs-6">
            {total > 0 ? `${total} jobs found` : "No jobs yet"} • Page {page}/{totalPages}
          </small>
        </div>
        <button
          className={`btn btn-outline-primary btn-icon-filter ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

      {showFilters && (
        <div className="card filter-card mb-4 shadow-sm">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium">Job title or keyword</label>
                <input
                  className="form-control"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g. Driver, Electrician..."
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-medium">Location</label>
                <input
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Dhaka, Chittagong..."
                />
              </div>
            </div>
            <button className="btn btn-outline-secondary mt-3 px-4" onClick={() => { setQ(""); setLocation(""); }}>
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center my-5 py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading available jobs...</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger my-5 py-4">
          <i className="fa-solid fa-triangle-exclamation me-2"></i>
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={fetchJobs}>Retry</button>
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="alert alert-info text-center my-5 py-4">
          No jobs found matching your criteria.
        </div>
      )}

      {!loading && jobs.length > 0 && (
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
                  <h5 className="card-title mb-2 fw-semibold text-truncate">{job.title}</h5>
                  <div className="job-meta text-muted mb-3 d-flex flex-wrap gap-3 small">
                    <span>📍 {job.location || "Not specified"}</span>
                    <span>💰 {job.salary || "Negotiable"}</span>
                  </div>
                  <p className="card-text text-secondary mb-3">
                    {(job.description || "").slice(0, 140)}
                    {(job.description || "").length > 140 ? "..." : ""}
                  </p>
                  {user?.role === "worker" ? (
                    <Link to={`/jobs/${job.id || job._id}`} className="btn btn-primary w-100 mt-auto">
                      Apply Now
                    </Link>
                  ) : (
                    <Link to="/login" className="btn btn-outline-secondary w-100 mt-auto">
                      Login to Apply
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="pagination-wrapper d-flex justify-content-between align-items-center mt-5 mb-5">
          <button
            className="btn btn-outline-primary pagination-btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <i className="bi bi-chevron-left me-1"></i> Prev
          </button>
          <span className="page-info text-muted">
            Page <strong className="text-dark">{page}</strong> of{" "}
            <strong className="text-dark">{totalPages}</strong>
          </span>
          <button
            className="btn btn-outline-primary pagination-btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <i className="bi bi-chevron-right ms-1"></i>
          </button>
        </div>
      )}
    </div>
  );
}
