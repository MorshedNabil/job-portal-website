import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/JobDetails.css";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((s) => s.auth.user);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);

  const handleBack = () => {
    if (location.key && location.key !== "default") navigate(-1);
    else navigate("/jobs");
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setErrMsg("");
        const { data } = await api.get(`/jobs/${id}/`);
        setJob(data);
      } catch (err) {
        setErrMsg(err.response?.data?.message || "Failed to load job details");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    if (user.role !== "worker") {
      alert("Only workers can apply");
      return;
    }
    if (!job?.id) {
      alert("Job not found");
      return;
    }
    if (!cvFile) {
      alert("Please select a CV file first");
      return;
    }

    try {
      setApplyLoading(true);
      const formData = new FormData();
      formData.append("jobId", job.id);
      formData.append("cv", cvFile);
      await api.post("/applications/", formData);
      alert("✅ Applied successfully!");
      setCvFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading job details...</p>;
  if (errMsg) return <p className="text-center mt-5 text-danger">{errMsg}</p>;
  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  return (
    <div className="container page-wrap">
      <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
        <i className="fa-solid fa-arrow-left me-2"></i>Back
      </button>

      <div className="card card-pro">
        <div className="card-body p-4">
          <h3 className="fw-bold mb-1">{job.title}</h3>

          <p className="text-muted2 mb-3">
            <i className="fa-solid fa-location-dot me-2 text-primary"></i>
            {job.location || "N/A"}{" "}
            <span className="mx-2">•</span>
            <i className="fa-solid fa-sack-dollar me-2 text-primary"></i>
            {job.salary || "N/A"}
          </p>

          <p className="text-muted2">{job.description}</p>

          <p className="mb-0">
            <strong>Posted By:</strong> {job.postedBy?.name || job.company?.name || "N/A"}
          </p>

          <hr />

          {user?.role === "worker" ? (
            <div className="mt-3">
              <label className="form-label fw-bold">
                <i className="fa-solid fa-file-arrow-up me-2 text-primary"></i>
                Upload CV (PDF/DOC/DOCX)
              </label>
              <input
                type="file"
                className="form-control mb-3"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
              <button className="btn btn-pro" onClick={handleApply} disabled={applyLoading}>
                <i className="fa-solid fa-paper-plane me-2"></i>
                {applyLoading ? "Applying..." : "Apply Now"}
              </button>
            </div>
          ) : (
            <div className="text-muted2">
              <i className="fa-solid fa-circle-info me-2"></i>
              Login as worker to apply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
