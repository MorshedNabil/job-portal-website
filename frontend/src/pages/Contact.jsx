import React, { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-2">Contact</h2>
      <p className="text-muted mb-4">Have questions? Send us a message.</p>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="p-4 border rounded-4">
            {sent && <div className="alert alert-success">✅ Message sent! (demo)</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Message</label>
                <textarea
                  className="form-control"
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <button className="btn btn-primary px-4">
                <i className="bi bi-send me-2"></i>Send
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="p-4 border rounded-4 h-100">
            <h5 className="fw-semibold mb-3">Support Info</h5>
            <div className="text-muted mb-2">
              <i className="bi bi-geo-alt me-2"></i>Bangladesh
            </div>
            <div className="text-muted mb-2">
              <i className="bi bi-envelope me-2"></i>support@kaajkormo.com (demo)
            </div>
            <div className="text-muted mb-2">
              <i className="bi bi-telephone me-2"></i>+880 1XXXXXXXXX (demo)
            </div>
            <hr />
            <div className="small text-muted">
              Note: This is a demo contact page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
