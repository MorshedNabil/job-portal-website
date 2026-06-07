import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  ClipboardList,
  FileText,
  LogOut,
  Search,
  Shield,
  Trash2,
  Upload,
  User,
  UserPlus,
  X,
} from "lucide-react";
import "./styles.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const TOKEN_KEY = "job_portal_token";
const USER_KEY = "job_portal_user";

function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

function asArrayPayload(payload) {
  return Array.isArray(payload) ? payload : payload?.items || [];
}

function getErrorMessage(error) {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  if (error && typeof error === "object") {
    const first = Object.values(error)[0];
    if (Array.isArray(first)) return first[0];
    if (typeof first === "string") return first;
  }
  return "Something went wrong. Please try again.";
}

async function request(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();
  if (!response.ok) throw data;
  return data;
}

function App() {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [view, setView] = useState("jobs");
  const [toast, setToast] = useState("");

  const api = useMemo(() => ({
    get: (path) => request(path, { token }),
    post: (path, body, isForm = false) => request(path, { method: "POST", body, token, isForm }),
    put: (path, body) => request(path, { method: "PUT", body, token }),
    patch: (path, body) => request(path, { method: "PATCH", body, token }),
    delete: (path) => request(path, { method: "DELETE", token }),
  }), [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/api/users/me/")
      .then((profile) => {
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      })
      .catch(() => handleLogout());
  }, [token]);

  function flash(message) {
    setToast(message);
    window.clearTimeout(window.__jobPortalToast);
    window.__jobPortalToast = window.setTimeout(() => setToast(""), 3200);
  }

  function handleAuth(payload) {
    const nextToken = payload.token;
    const nextUser = { ...payload };
    delete nextUser.token;
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setView(nextUser.role === "admin" ? "admin" : nextUser.role === "company" ? "company" : "jobs");
    flash(`Welcome, ${nextUser.name}`);
  }

  function handleLogout() {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setView("jobs");
  }

  const role = user?.role;
  const stats = [
    { label: "Open roles", value: "Live", icon: BriefcaseBusiness },
    { label: "Worker flow", value: role === "worker" ? "Ready" : "Browse", icon: FileText },
    { label: "Company desk", value: role === "company" ? "Active" : "Hiring", icon: Building2 },
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("jobs")} aria-label="Go to jobs">
          <span className="brand-mark"><BriefcaseBusiness size={20} /></span>
          <span>Job Portal</span>
        </button>
        <nav className="nav-tabs" aria-label="Primary navigation">
          <NavButton active={view === "jobs"} icon={Search} label="Jobs" onClick={() => setView("jobs")} />
          {role === "worker" && <NavButton active={view === "worker"} icon={ClipboardList} label="Applications" onClick={() => setView("worker")} />}
          {role === "company" && <NavButton active={view === "company"} icon={Building2} label="Company" onClick={() => setView("company")} />}
          {role === "admin" && <NavButton active={view === "admin"} icon={Shield} label="Admin" onClick={() => setView("admin")} />}
          {user && <NavButton active={view === "profile"} icon={User} label="Profile" onClick={() => setView("profile")} />}
        </nav>
        <div className="session-actions">
          {user ? (
            <>
              <span className={`role-pill ${role}`}>{role}</span>
              <button className="icon-button" onClick={handleLogout} title="Sign out" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <button className="primary-button compact" onClick={() => setView("auth")}>
              <UserPlus size={17} /> Sign in
            </button>
          )}
        </div>
      </header>

      {toast && <div className="toast">{toast}</div>}

      <main>
        <section className="hero-band">
          <div className="hero-copy">
            <p className="eyebrow">Django REST job board</p>
            <h1>Find work, post roles, and manage applications from one clean workspace.</h1>
          </div>
          <div className="hero-stats">
            {stats.map((item) => <Stat key={item.label} {...item} />)}
          </div>
        </section>

        {view === "jobs" && <JobsView api={api} user={user} onAuth={() => setView("auth")} flash={flash} />}
        {view === "auth" && <AuthView onAuth={handleAuth} />}
        {view === "worker" && <WorkerView api={api} flash={flash} />}
        {view === "company" && <CompanyView api={api} flash={flash} />}
        {view === "admin" && <AdminView api={api} flash={flash} />}
        {view === "profile" && <ProfileView api={api} user={user} setUser={setUser} flash={flash} />}
      </main>
    </div>
  );
}

function NavButton({ active, icon: Icon, label, onClick }) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} onClick={onClick}>
      <Icon size={17} /> <span>{label}</span>
    </button>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="stat">
      <Icon size={18} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="section-header">
      <div>
        <p className="eyebrow"><Icon size={15} /> {title}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function JobsView({ api, user, onAuth, flash }) {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState(null);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobForm, setJobForm] = useState({ title: "", location: "", salary: "", imageUrl: "", description: "" });

  function loadJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    api.get(`/api/jobs/${params.toString() ? `?${params}` : ""}`)
      .then((data) => setJobs(asArrayPayload(data)))
      .catch((error) => flash(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }

  useEffect(loadJobs, []);

  async function applyToJob(event) {
    event.preventDefault();
    if (!user) return onAuth();
    if (user.role !== "worker") return flash("Only worker accounts can apply for jobs.");
    if (!cv || !selected) return flash("Choose a CV file first.");
    const form = new FormData();
    form.append("jobId", selected.id);
    form.append("cv", cv);
    try {
      await api.post("/api/applications/", form, true);
      setCv(null);
      flash("Application submitted.");
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  async function createJob(event) {
    event.preventDefault();
    try {
      const created = await api.post("/api/jobs/", jobForm);
      setJobs([created, ...jobs]);
      setJobForm({ title: "", location: "", salary: "", imageUrl: "", description: "" });
      flash("Job posted.");
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  return (
    <section className="content-grid two-column">
      <div className="panel wide">
        <SectionHeader icon={BriefcaseBusiness} title="Jobs" />
        <form className="filter-row" onSubmit={(event) => { event.preventDefault(); loadJobs(); }}>
          <label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title" /></label>
          <label><Building2 size={16} /><input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Location" /></label>
          <button className="primary-button" type="submit"><Search size={17} /> Search</button>
        </form>
        <div className="job-list">
          {loading && <p className="muted">Loading jobs...</p>}
          {!loading && jobs.length === 0 && <EmptyState label="No jobs found." />}
          {jobs.map((job) => (
            <article className={`job-card ${selected?.id === job.id ? "selected" : ""}`} key={job.id} onClick={() => setSelected(job)}>
              <div className="job-image" style={{ backgroundImage: job.imageUrl ? `url(${job.imageUrl})` : undefined }}>
                {!job.imageUrl && <BriefcaseBusiness size={28} />}
              </div>
              <div>
                <h3>{job.title}</h3>
                <p>{job.description || "No description provided."}</p>
                <div className="meta-row">
                  <span>{job.location || "Remote"}</span>
                  <span>{job.salary || "Salary undisclosed"}</span>
                  <span>{job.postedBy?.name || "Company"}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="side-stack">
        <div className="panel">
          <SectionHeader icon={FileText} title="Apply" />
          {selected ? (
            <form className="stack-form" onSubmit={applyToJob}>
              <h3>{selected.title}</h3>
              <p className="muted">{selected.location || "Remote"} - {selected.salary || "Salary undisclosed"}</p>
              <label className="file-input">
                <Upload size={18} />
                <span>{cv?.name || "Choose CV file"}</span>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setCv(event.target.files[0])} />
              </label>
              <button className="primary-button" type="submit"><FileText size={17} /> Apply now</button>
            </form>
          ) : <EmptyState label="Select a job to apply." />}
        </div>

        {user?.role === "company" && (
          <div className="panel">
            <SectionHeader icon={Building2} title="Post Job" />
            <form className="stack-form" onSubmit={createJob}>
              <input required value={jobForm.title} onChange={(event) => setJobForm({ ...jobForm, title: event.target.value })} placeholder="Job title" />
              <input value={jobForm.location} onChange={(event) => setJobForm({ ...jobForm, location: event.target.value })} placeholder="Location" />
              <input value={jobForm.salary} onChange={(event) => setJobForm({ ...jobForm, salary: event.target.value })} placeholder="Salary" />
              <input value={jobForm.imageUrl} onChange={(event) => setJobForm({ ...jobForm, imageUrl: event.target.value })} placeholder="Image URL" />
              <textarea value={jobForm.description} onChange={(event) => setJobForm({ ...jobForm, description: event.target.value })} placeholder="Description" rows="5" />
              <button className="primary-button" type="submit"><BriefcaseBusiness size={17} /> Publish</button>
            </form>
          </div>
        )}
      </aside>
    </section>
  );
}

function AuthView({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("worker");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", adminId: "" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    const path = mode === "login" ? "/api/auth/login/" : role === "admin" ? "/api/auth/admin-register/" : "/api/auth/register/";
    const body = mode === "login"
      ? { identifier: form.email, password: form.password }
      : role === "admin"
        ? { name: form.name, email: form.email, password: form.password, confirmPassword: form.confirmPassword, adminId: form.adminId }
        : { name: form.name, email: form.email, password: form.password, role };
    try {
      onAuth(await request(path, { method: "POST", body }));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <section className="auth-layout">
      <div className="panel auth-panel">
        <div className="segmented">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Register</button>
        </div>
        {mode === "register" && (
          <div className="segmented">
            {["worker", "company", "admin"].map((item) => (
              <button key={item} className={role === item ? "active" : ""} onClick={() => setRole(item)}>{item}</button>
            ))}
          </div>
        )}
        <form className="stack-form" onSubmit={submit}>
          {mode === "register" && <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" />}
          <input required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder={mode === "login" ? "Email or admin ID" : "Email"} />
          <input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />
          {mode === "register" && role === "admin" && (
            <>
              <input required type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Confirm password" />
              <input required value={form.adminId} onChange={(event) => setForm({ ...form, adminId: event.target.value })} placeholder="12 digit admin ID" />
            </>
          )}
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" type="submit"><UserPlus size={17} /> Continue</button>
        </form>
      </div>
    </section>
  );
}

function WorkerView({ api, flash }) {
  const [apps, setApps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/api/applications/").then(setApps).catch((error) => flash(getErrorMessage(error)));
    api.get("/api/notifications/me/").then(setNotifications).catch(() => {});
  }, []);

  async function markRead(id) {
    const updated = await api.patch(`/api/notifications/${id}/read/`, {});
    setNotifications(notifications.map((item) => item.id === id ? updated : item));
  }

  return (
    <section className="content-grid two-column">
      <div className="panel wide">
        <SectionHeader icon={ClipboardList} title="My Applications" />
        <DataList items={apps} empty="No applications yet." render={(app) => (
          <div className="row-card" key={app.id}>
            <div>
              <h3>{app.job?.title || "Job"}</h3>
              <p>{app.job?.location || "Remote"} - {app.job?.postedBy?.name || "Company"}</p>
            </div>
            <span className={`status ${app.status}`}>{app.status}</span>
          </div>
        )} />
      </div>
      <div className="panel">
        <SectionHeader icon={Bell} title="Notifications" />
        <DataList items={notifications} empty="No notifications." render={(note) => (
          <div className={`notice ${note.isRead ? "" : "unread"}`} key={note.id}>
            <div>
              <h3>{note.title}</h3>
              <p>{note.message}</p>
            </div>
            {!note.isRead && <button className="icon-button" onClick={() => markRead(note.id)} title="Mark read"><Check size={17} /></button>}
          </div>
        )} />
      </div>
    </section>
  );
}

function CompanyView({ api, flash }) {
  const [apps, setApps] = useState([]);

  function load() {
    api.get("/api/company/applications/").then(setApps).catch((error) => flash(getErrorMessage(error)));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/api/company/applications/${id}/status/`, { status });
      flash("Application updated.");
      load();
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  return (
    <section className="panel">
      <SectionHeader icon={Building2} title="Company Applications" />
      <DataList items={apps} empty="No applications for your jobs yet." render={(app) => (
        <div className="row-card action-row" key={app.id}>
          <div>
            <h3>{app.applicant?.name || "Applicant"} - {app.job?.title || "Job"}</h3>
              <p>{app.applicant?.email} - <a href={assetUrl(app.cvUrl)} target="_blank" rel="noreferrer">CV</a></p>
          </div>
          <span className={`status ${app.status}`}>{app.status}</span>
          {app.status === "pending" && (
            <div className="button-pair">
              <button className="icon-button positive" onClick={() => updateStatus(app.id, "accepted")} title="Accept"><Check size={17} /></button>
              <button className="icon-button danger" onClick={() => updateStatus(app.id, "rejected")} title="Reject"><X size={17} /></button>
            </div>
          )}
        </div>
      )} />
    </section>
  );
}

function ProfileView({ api, user, setUser, flash }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [cv, setCv] = useState(null);
  const [cvUrl, setCvUrl] = useState(user?.cvUrl || "");

  useEffect(() => {
    api.get("/api/cv/me/").then((data) => setCvUrl(data.cvUrl || "")).catch(() => {});
  }, []);

  async function saveProfile(event) {
    event.preventDefault();
    try {
      const profile = await api.put("/api/users/me/", form);
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      flash("Profile saved.");
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  async function uploadCv(event) {
    event.preventDefault();
    if (!cv) return flash("Choose a CV file first.");
    const data = new FormData();
    data.append("cv", cv);
    const response = await api.post("/api/cv/", data, true);
    setCvUrl(response.cvUrl);
    flash("CV uploaded.");
  }

  return (
    <section className="content-grid two-column">
      <div className="panel">
        <SectionHeader icon={User} title="Profile" />
        <form className="stack-form" onSubmit={saveProfile}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" />
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
          <button className="primary-button" type="submit"><Check size={17} /> Save</button>
        </form>
      </div>
      <div className="panel">
        <SectionHeader icon={Upload} title="CV" />
        <form className="stack-form" onSubmit={uploadCv}>
          <label className="file-input">
            <Upload size={18} />
            <span>{cv?.name || "Choose CV file"}</span>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(event) => setCv(event.target.files[0])} />
          </label>
          {cvUrl && <a className="inline-link" href={assetUrl(cvUrl)} target="_blank" rel="noreferrer">View uploaded CV</a>}
          <button className="primary-button" type="submit"><Upload size={17} /> Upload</button>
        </form>
      </div>
    </section>
  );
}

function AdminView({ api, flash }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "", adminId: "" });

  function load() {
    api.get("/api/admin/users/").then(setUsers).catch((error) => flash(getErrorMessage(error)));
    api.get("/api/admin/jobs/").then(setJobs).catch(() => {});
    api.get("/api/admin/applications/").then(setApps).catch(() => {});
  }

  useEffect(load, []);

  async function remove(path) {
    try {
      await api.delete(path);
      flash("Deleted.");
      load();
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  async function addAdmin(event) {
    event.preventDefault();
    try {
      await api.post("/api/admin/add/", adminForm);
      setAdminForm({ name: "", email: "", password: "", adminId: "" });
      flash("Admin added.");
      load();
    } catch (error) {
      flash(getErrorMessage(error));
    }
  }

  return (
    <section className="panel">
      <SectionHeader icon={Shield} title="Admin Console" />
      <div className="segmented left">
        {["users", "jobs", "applications", "add admin"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>

      {tab === "users" && <DataList items={users} empty="No users." render={(item) => (
        <div className="row-card action-row" key={item.id}>
          <div><h3>{item.name}</h3><p>{item.email} - {item.role}</p></div>
          <button className="icon-button danger" onClick={() => remove(`/api/admin/users/${item.id}/`)} title="Delete user"><Trash2 size={17} /></button>
        </div>
      )} />}

      {tab === "jobs" && <DataList items={jobs} empty="No jobs." render={(item) => (
        <div className="row-card action-row" key={item.id}>
          <div><h3>{item.title}</h3><p>{item.location || "Remote"} - {item.postedBy?.name || "Company"}</p></div>
          <button className="icon-button danger" onClick={() => remove(`/api/admin/jobs/${item.id}/`)} title="Delete job"><Trash2 size={17} /></button>
        </div>
      )} />}

      {tab === "applications" && <DataList items={apps} empty="No applications." render={(item) => (
        <div className="row-card action-row" key={item.id}>
          <div><h3>{item.applicant?.name || "Applicant"} - {item.job?.title || "Job"}</h3><p>{item.status}</p></div>
          <button className="icon-button danger" onClick={() => remove(`/api/admin/applications/${item.id}/`)} title="Delete application"><Trash2 size={17} /></button>
        </div>
      )} />}

      {tab === "add admin" && (
        <form className="stack-form narrow" onSubmit={addAdmin}>
          <input required value={adminForm.name} onChange={(event) => setAdminForm({ ...adminForm, name: event.target.value })} placeholder="Name" />
          <input required value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} placeholder="Email" />
          <input required type="password" minLength="6" value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} placeholder="Password" />
          <input required value={adminForm.adminId} onChange={(event) => setAdminForm({ ...adminForm, adminId: event.target.value })} placeholder="12 digit admin ID" />
          <button className="primary-button" type="submit"><Shield size={17} /> Add admin</button>
        </form>
      )}
    </section>
  );
}

function DataList({ items, empty, render }) {
  if (!items?.length) return <EmptyState label={empty} />;
  return <div className="data-list">{items.map(render)}</div>;
}

function EmptyState({ label }) {
  return <div className="empty-state">{label}</div>;
}

createRoot(document.getElementById("root")).render(<App />);
