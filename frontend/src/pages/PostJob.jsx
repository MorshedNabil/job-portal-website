import React, { useState } from "react";
import api from "../services/api";
import { useSelector } from "react-redux";
import "../css/PostJob.css";

const INITIAL = {
  title: "", description: "", location: "", salary: "",
  vacancy: "", age_range: "", experience: "", deadline: "",
  education: "", skills: "", requirements: "", responsibilities: "",
  company_name: "", company_about: "", company_address: "",
};

export default function PostJob() {
  const user = useSelector((s) => s.auth.user);
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!form.title.trim() || !form.description.trim() || !form.location.trim() || !form.salary.trim()) {
      setErrorMsg("Please fill in all required fields (Title, Description, Location, Salary).");
      return;
    }

    setLoading(true);
    try {
      await api.post("/jobs/", {
        title:            form.title.trim(),
        description:      form.description.trim(),
        location:         form.location.trim(),
        salary:           form.salary.trim(),
        vacancy:          form.vacancy ? parseInt(form.vacancy, 10) : null,
        age_range:        form.age_range.trim(),
        experience:       form.experience.trim(),
        deadline:         form.deadline || null,
        education:        form.education.trim(),
        skills:           form.skills.trim(),
        requirements:     form.requirements.trim(),
        responsibilities: form.responsibilities.trim(),
        company_name:     form.company_name.trim(),
        company_about:    form.company_about.trim(),
        company_address:  form.company_address.trim(),
      });
      setSuccessMsg("Job posted successfully!");
      setForm(INITIAL);
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
          <p className="text-muted mb-0">Fill in the details to attract the right candidates</p>
        </div>

        {successMsg && (
          <div className="alert alert-success d-flex align-items-center mx-3 mt-3">
            <i className="fa-solid fa-circle-check me-2"></i>{successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="alert alert-danger d-flex align-items-center mx-3 mt-3">
            <i className="fa-solid fa-circle-exclamation me-2"></i>{errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="job-form">

          {/* ── Section: Basic Info ── */}
          <div className="pj-section-label">
            <i className="fa-solid fa-circle-info me-2"></i>Basic Information
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-heading me-2 text-primary"></i>
              Job Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. Junior Software Engineer"
              value={form.title}
              onChange={set("title")}
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
              rows={4}
              placeholder="Brief overview of the role..."
              value={form.description}
              onChange={set("description")}
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
                placeholder="e.g. Dhaka, Remote..."
                value={form.location}
                onChange={set("location")}
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
                placeholder="e.g. Negotiable / ৳35,000–60,000"
                value={form.salary}
                onChange={set("salary")}
                required
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-users me-2 text-primary"></i>
                Vacancy
              </label>
              <input
                type="number"
                min="1"
                className="form-control form-control-lg"
                placeholder="e.g. 2"
                value={form.vacancy}
                onChange={set("vacancy")}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-calendar-days me-2 text-primary"></i>
                Application Deadline
              </label>
              <input
                type="date"
                className="form-control form-control-lg"
                value={form.deadline}
                onChange={set("deadline")}
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-person me-2 text-primary"></i>
                Age Range
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. 24 to 40 years"
                value={form.age_range}
                onChange={set("age_range")}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">
                <i className="fa-solid fa-briefcase me-2 text-primary"></i>
                Experience
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="e.g. At most 2 years"
                value={form.experience}
                onChange={set("experience")}
              />
            </div>
          </div>

          {/* ── Section: Requirements ── */}
          <div className="pj-section-label">
            <i className="fa-solid fa-list-check me-2"></i>Requirements
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-graduation-cap me-2 text-primary"></i>
              Education
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. Bachelor/Honors in Computer Science or related field"
              value={form.education}
              onChange={set("education")}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-code me-2 text-primary"></i>
              Skills
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="e.g. React, Node.js, Python, Communication skills..."
              value={form.skills}
              onChange={set("skills")}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-clipboard-list me-2 text-primary"></i>
              Additional Requirements
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Any other specific requirements for this role..."
              value={form.requirements}
              onChange={set("requirements")}
            />
          </div>

          {/* ── Section: Responsibilities ── */}
          <div className="pj-section-label">
            <i className="fa-solid fa-square-check me-2"></i>Responsibilities
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-bars me-2 text-primary"></i>
              Job Responsibilities
            </label>
            <textarea
              className="form-control"
              rows={5}
              placeholder="Describe the key duties and responsibilities of the role..."
              value={form.responsibilities}
              onChange={set("responsibilities")}
            />
          </div>

          {/* ── Section: Company Information ── */}
          <div className="pj-section-label">
            <i className="fa-solid fa-building me-2"></i>Company Information
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-building me-2 text-primary"></i>
              Company Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. Indetechs Software Limited"
              value={form.company_name}
              onChange={set("company_name")}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-circle-info me-2 text-primary"></i>
              About Company
            </label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Brief description of your company, culture, and mission..."
              value={form.company_about}
              onChange={set("company_about")}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-map-pin me-2 text-primary"></i>
              Company Address
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="e.g. House 12, Road 5, Gulshan, Dhaka"
              value={form.company_address}
              onChange={set("company_address")}
            />
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
