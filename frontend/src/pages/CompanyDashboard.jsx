import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useSelector } from "react-redux";

export default function CompanyDashboard() {
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate("/login");
    if (user.role !== "company") return navigate("/");
  }, [user, navigate]);

  const fetchApps = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/company/applications/");
      setApps(Array.isArray(data) ? data : (data.results || []));
    } catch (err) {
      console.error("Failed to load applications:", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "company") fetchApps();
  }, [user, fetchApps]);

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/company/applications/${appId}/status/`, { status });
      alert(status === "accepted" ? "Applicant accepted ✅" : "Applicant rejected ❌");
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!user) return null;

  return (
    <div className="container page-wrap">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="m-0 fw-bold">
          <i className="fa-solid fa-building me-2 text-primary"></i>
          Company Dashboard
        </h3>
        <Link className="btn btn-pro" to="/post-job">
          <i className="fa-solid fa-square-plus me-2"></i>Post Job
        </Link>
      </div>

      <div className="card card-pro">
        <div className="card-body">
          <h5 className="mb-3 fw-bold">
            <i className="fa-solid fa-file-lines me-2 text-primary"></i>
            Applications
          </h5>

          {loading && <p className="text-muted mb-0">Loading applications...</p>}

          {!loading && apps.length === 0 && (
            <div className="alert alert-info mb-0">No applications yet for your jobs.</div>
          )}

          {!loading && apps.length > 0 && (
            <div className="table-responsive">
              <table className="table table-pro table-hover table-bordered align-middle">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Applicant</th>
                    <th>Status</th>
                    <th>CV</th>
                    <th>Applied At</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id || a._id}>
                      <td>{a.job?.title || "Job Deleted"}</td>
                      <td>
                        <div className="fw-bold">{a.applicant?.name || "N/A"}</div>
                        <div className="text-muted small">{a.applicant?.email || ""}</div>
                      </td>
                      <td>
                        <span className={`badge-soft ${a.status} me-2`}>{a.status}</span>
                        {a.status === "pending" ? (
                          <>
                            <button
                              className="btn btn-sm btn-success me-2"
                              onClick={() => updateStatus(a.id || a._id, "accepted")}
                            >
                              <i className="fa-solid fa-check me-1"></i>Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => updateStatus(a.id || a._id, "rejected")}
                            >
                              <i className="fa-solid fa-xmark me-1"></i>Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-muted ms-2">
                            <i className="fa-solid fa-lock me-1"></i>Locked
                          </span>
                        )}
                      </td>
                      <td>
                        {a.cvUrl ? (
                          <a
                            className="btn btn-sm btn-outline-primary"
                            href={a.cvUrl}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <i className="fa-solid fa-file-pdf me-2"></i>View CV
                          </a>
                        ) : "-"}
                      </td>
                      <td>{a.createdAt ? new Date(a.createdAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
