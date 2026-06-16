import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import "../css/Navbar.css";

export default function Navbar() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-pro">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={closeMenu}>
          <span className="fw-semibold">Kaj Kormo</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>
                <i className="fa-solid fa-house me-2"></i>Home
              </Link>
            </li>

            {user?.role === "worker" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/jobs" onClick={closeMenu}>
                    <i className="fa-solid fa-magnifying-glass me-2"></i>Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={closeMenu}>
                    <i className="fa-solid fa-user me-2"></i>Profile
                  </Link>
                </li>
              </>
            )}

            {user?.role === "company" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/company/dashboard" onClick={closeMenu}>
                    <i className="fa-solid fa-chart-line me-2"></i>Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/post-job" onClick={closeMenu}>
                    <i className="fa-solid fa-square-plus me-2"></i>Post Job
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={closeMenu}>
                    <i className="fa-solid fa-right-to-bracket me-2"></i>Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={closeMenu}>
                    <i className="fa-solid fa-user-plus me-2"></i>Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center">
                  <span className="nav-link">
                    <i className="fa-solid fa-hand-wave me-2"></i>
                    Hi, {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-light ms-2 btn-logout"
                    onClick={handleLogout}
                    type="button"
                  >
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
