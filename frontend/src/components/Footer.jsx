import React from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-pro">
      <div className="container py-5">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-4">
            <h5 className="text-white fw-bold mb-2">Kaaj Kormo</h5>
            <p className="small mb-3">
              Find jobs or hire skilled workers easily across Bangladesh.
            </p>

            <div className="d-flex gap-3 footer-social">
              <a className="social-link" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a className="social-link" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a className="social-link" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-6 col-lg-2">
            <div className="text-white fw-semibold mb-2">Company</div>
            <Link className="footer-link" to="/about">About</Link>
            <Link className="footer-link" to="/contact">Contact</Link>
            <Link className="footer-link" to="/careers">Careers</Link>
          </div>

          <div className="col-6 col-lg-2">
            <div className="text-white fw-semibold mb-2">Support</div>
            <Link className="footer-link" to="/help">Help Center</Link>
            <Link className="footer-link" to="/privacy">Privacy</Link>
            <Link className="footer-link" to="/terms">Terms</Link>
          </div>

          <div className="col-12 col-lg-4">
            <div className="text-white fw-semibold mb-2">Get updates</div>
            <div className="d-flex gap-2 footer-newsletter">
              <input className="form-control" placeholder="Email address" />
              <button className="btn btn-primary px-4">Subscribe</button>
            </div>
            <div className="small mt-2 opacity-75 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check"></i>
              <span>No spam, unsubscribe anytime.</span>
            </div>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "rgba(255,255,255,.12)" }} />

        <div className="d-flex flex-wrap justify-content-between align-items-center small gap-2">
          <div>© {new Date().getFullYear()} Kaaj Kormo. All rights reserved.</div>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-geo-alt"></i>
            <span>Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
