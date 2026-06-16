import React, { useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/PostJob.css";

export default function PostJob() {
  const user = useSelector((s) => s.auth.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!title.trim() || !description.trim() || !location.trim() || !salary.trim()) {
      setErrorMsg("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/jobs/", {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        salary: salary.trim(),
      });
      setSuccessMsg("Job posted successfully!");
      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "company") {
    return (
      <div className="unauthorized-message">
        <div className="alert alert-warning">
          <i className="fa-solid fa-lock me-2"></i>
          Only company accounts can post jobs.
        </div>
      </div>
    );
  }

  return (
    <div className="post-job-container">
      <div className="post-job-card">
        <div className="card-header text-center">
          <div className="header-icon mb-3">
            <i className="fa-solid fa-briefcase fa-2x"></i>
          </div>
          <h2>Post a New Job</h2>
          <p className="text-muted">Fill in the details to attract the right candidates</p>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center mx-3 mt-3">
            <i className="fa-solid fa-circle-check me-2"></i>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center mx-3 mt-3">
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-heading me-2 text-primary"></i>
              Job Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. Senior React Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-align-left me-2 text-primary"></i>
              Job Description <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control form-control-lg"
              rows={6}
              placeholder="Describe responsibilities, requirements, benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-location-dot me-2 text-primary"></i>
                Location <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Dhaka, Remote, Chittagong..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-sack-dollar me-2 text-primary"></i>
                Salary Range <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="৳ 35,000 - ৳ 60,000 / month"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-post w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Posting Job...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane me-2"></i>Post Job
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
