import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/JobDetails.css";

const FALLBACK_LOGO = "/default-job.jpg";

function ColoredTitle({ title }) {
  const words = (title || "").split(" ");
  const first = words[0];
  const rest = words.slice(1).join(" ");
  return (
    <h2 className="jd-job-title">
      <span className="jd-title-blue">{first}</span>
      {rest && <> <span className="jd-title-red">{rest}</span></>}
    </h2>
  );
}

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
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);

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
    if (!cvFile) { alert("Please select a CV file first"); return; }
    try {
      setApplyLoading(true);
      const formData = new FormData();
      formData.append("jobId", job.id);
      formData.append("cv", cvFile);
      await api.post("/applications/", formData);
      alert("Applied successfully!");
      setCvFile(null);
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Apply failed");
    } finally {
      setApplyLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const show = (section) => activeTab === "all" || activeTab === section;

  if (loading) return (
    <div className="text-center mt-5 py-5">
      <div className="spinner-border text-primary" role="status" />
      <p className="mt-3 text-muted">Loading job details...</p>
    </div>
  );
  if (errMsg) return <p className="text-center mt-5 text-danger">{errMsg}</p>;
  if (!job) return <p className="text-center mt-5">Job not found.</p>;

  const tabs = [
    { key: "all", label: "All" },
    { key: "requirements", label: "Requirements" },
    { key: "responsibilities", label: "Responsibilities" },
    { key: "company", label: "Company Information" },
  ];

  const companyName = job.company?.name || "";

  return (
    <div className="jd-page container">
      {/* Back */}
      <button className="jd-back-btn" onClick={handleBack}>
        <i className="fa-solid fa-chevron-left me-1"></i> Job List
      </button>

      {/* Header */}
      <div className="jd-card jd-header-card mb-3">
        <div className="d-flex align-items-start gap-3">
          <img
            src={job.company_logo || job.image_url || FALLBACK_LOGO}
            alt="logo"
            className="jd-company-logo"
            onError={(e) => (e.currentTarget.src = FALLBACK_LOGO)}
          />
          <div>
            {companyName && <p className="jd-company-name mb-1">{companyName}</p>}
            <ColoredTitle title={job.title} />
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="jd-card jd-action-bar mb-3">
        <div className="jd-deadline">
          Application Deadline :{" "}
          <span className="jd-deadline-date">
            {formatDate(job.deadline || job.application_deadline)}
          </span>
        </div>
        <div className="jd-actions">
          <button
            className="jd-apply-btn"
            onClick={() => {
              if (!user) { navigate("/login"); return; }
              if (user.role !== "worker") { alert("Only workers can apply"); return; }
              setShowModal(true);
            }}
          >
            Apply Now
          </button>
          <button className="jd-icon-btn">
            <i className="fa-regular fa-star me-1"></i>Save
          </button>
          <div className="jd-share-group">
            <span className="jd-share-label">
              <i className="fa-solid fa-share-nodes me-1"></i>Share:
            </span>
            <button className="jd-social fb"><i className="fa-brands fa-facebook-f"></i></button>
            <button className="jd-social li"><i className="fa-brands fa-linkedin-in"></i></button>
            <button className="jd-social wa"><i className="fa-brands fa-whatsapp"></i></button>
          </div>
          <button className="jd-icon-btn" onClick={() => window.print()}>
            <i className="fa-solid fa-print"></i>
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="jd-card jd-tab-nav mb-3">
        <button className="jd-tab-arrow">
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`jd-tab${activeTab === tab.key ? " active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button className="jd-tab-arrow">
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>

      {/* Info grid — always visible */}
      <div className="jd-card jd-info-grid mb-3">
        <div className="jd-info-item">
          <span className="jd-info-label">Vacancy:</span>
          <span className="jd-info-val">{job.vacancy ?? "N/A"}</span>
        </div>
        <div className="jd-info-item">
          <span className="jd-info-label">Age:</span>
          <span className="jd-info-val">{job.age_range || job.age || "N/A"}</span>
        </div>
        <div className="jd-info-item">
          <span className="jd-info-label">Location:</span>
          <span className="jd-info-val jd-info-blue">{job.location || "N/A"}</span>
        </div>
        <div className="jd-info-item">
          <span className="jd-info-label">Salary:</span>
          <span className="jd-info-val">{job.salary || "Negotiable"}</span>
        </div>
        <div className="jd-info-item">
          <span className="jd-info-label">Experience:</span>
          <span className="jd-info-val">{job.experience || "N/A"}</span>
        </div>
        <div className="jd-info-item">
          <span className="jd-info-label">Published:</span>
          <span className="jd-info-val">{formatDate(job.created_at || job.posted_at)}</span>
        </div>
      </div>

      {/* Video CV notice */}
      {show("all") && (
        <div className="jd-video-notice mb-3">
          Applicants are encouraged to submit <strong>Video CV.</strong>
        </div>
      )}

      {/* Requirements */}
      {show("requirements") && (
        <div className="jd-card jd-section mb-3">
          <h5 className="jd-section-title color-red">Requirements</h5>
          {job.education && (
            <>
              <h6 className="jd-sub-title">Education</h6>
              <ul className="jd-list">
                {Array.isArray(job.education)
                  ? job.education.map((e, i) => <li key={i}>{e}</li>)
                  : <li>{job.education}</li>}
              </ul>
            </>
          )}
          {job.experience && (
            <>
              <h6 className="jd-sub-title">Experience</h6>
              <p className="jd-body-text">{job.experience}</p>
            </>
          )}
          {job.skills && (
            <>
              <h6 className="jd-sub-title">Skills</h6>
              <ul className="jd-list">
                {Array.isArray(job.skills)
                  ? job.skills.map((s, i) => <li key={i}>{s}</li>)
                  : <li>{job.skills}</li>}
              </ul>
            </>
          )}
          {job.requirements && (
            <p className="jd-body-text" style={{ whiteSpace: "pre-wrap" }}>{job.requirements}</p>
          )}
          {!job.requirements && !job.education && !job.experience && !job.skills && (
            <p className="jd-body-text">{job.description || "No requirements specified."}</p>
          )}
        </div>
      )}

      {/* Responsibilities */}
      {show("responsibilities") && (
        <div className="jd-card jd-section mb-3">
          <h5 className="jd-section-title color-blue">Responsibilities</h5>
          {job.responsibilities ? (
            <p className="jd-body-text" style={{ whiteSpace: "pre-wrap" }}>{job.responsibilities}</p>
          ) : (
            <p className="jd-body-text text-muted">No responsibilities specified yet.</p>
          )}
        </div>
      )}

      {/* Company Information */}
      {show("company") && (
        <div className="jd-card jd-section mb-3">
          <h5 className="jd-section-title color-purple">Company Information</h5>
          <p className="jd-body-text mb-2">
            <strong>Name:</strong> {companyName}
          </p>
          {job.company?.about && (
            <p className="jd-body-text mb-2">
              <strong>About:</strong> {job.company.about}
            </p>
          )}
          {job.company?.address && (
            <p className="jd-body-text mb-2">
              <strong>Address:</strong> {job.company.address}
            </p>
          )}
          {!job.company?.about && !job.company?.address && (
            <p className="jd-body-text text-muted">No additional company details available.</p>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {showModal && (
        <div className="jd-overlay" onClick={() => setShowModal(false)}>
          <div className="jd-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jd-modal-head">
              <h5>Apply for {job.title}</h5>
              <button onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="jd-modal-body">
              <label className="form-label fw-semibold mb-2">
                Upload CV (PDF / DOC / DOCX)
              </label>
              <input
                type="file"
                className="form-control mb-3"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              />
              <button
                className="jd-apply-btn w-100"
                onClick={handleApply}
                disabled={applyLoading || !cvFile}
              >
                <i className="fa-solid fa-paper-plane me-2"></i>
                {applyLoading ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
