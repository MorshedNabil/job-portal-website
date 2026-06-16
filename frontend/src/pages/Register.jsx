import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../store/authSlice";
import "../css/Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (error) alert(error);
    if (user) navigate("/");
  }, [error, user, navigate]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return alert("All fields are required");
    }
    if (password !== confirmPassword) return alert("Passwords do not match");
    if (role === "admin") return alert("Admin registration not allowed here");

    const res = await dispatch(registerThunk({ name, email, phone, password, role }));
    if (res.meta.requestStatus === "fulfilled") {
      alert("Registration successful! You can now login.");
      navigate("/login");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="text-center mb-4">
          <div className="logo-icon mb-3">
            <i className="fa-solid fa-user-plus fa-3x"></i>
          </div>
          <h2 className="mb-1">Create Account</h2>
          <p className="text-muted">Join our job portal today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="fa-solid fa-user me-2 text-primary"></i>Full Name
            </label>
            <input
              className="form-control form-control-lg"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="fa-solid fa-envelope me-2 text-primary"></i>Email Address
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="fa-solid fa-phone me-2 text-primary"></i>Phone Number
            </label>
            <input
              type="tel"
              className="form-control form-control-lg"
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="fa-solid fa-lock me-2 text-primary"></i>Password
            </label>
            <div className="input-group input-group-lg">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-lock me-2 text-primary"></i>Confirm Password
            </label>
            <div className="input-group input-group-lg">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i className={`fa-solid ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>
            {passwordError && (
              <div className="text-danger mt-1 small d-flex align-items-center">
                <i className="fa-solid fa-circle-exclamation me-2"></i>
                {passwordError}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-briefcase me-2 text-primary"></i>Register As
            </label>
            <select
              className="form-select form-select-lg"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="worker">Job Seeker (Worker)</option>
              <option value="company">Company / Employer</option>
            </select>
          </div>

          <button
            className="btn btn-primary btn-register w-100"
            type="submit"
            disabled={loading || !!passwordError}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-check me-2"></i>Register
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-primary text-decoration-none fw-medium">
              Sign in
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
