import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../store/authSlice";
import "../css/Login.css";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((s) => s.auth);

  useEffect(() => {
    if (!user) return;
    if (user.role === "worker") navigate("/profile");
    else if (user.role === "company") navigate("/post-job");
    else navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return alert("All fields are required");
    dispatch(loginThunk({ identifier, password }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="text-center mb-4">
          <div className="logo-icon mb-3">
            <i className="fa-solid fa-user-shield fa-3x"></i>
          </div>
          <h2 className="mb-1">Welcome Back</h2>
          <p className="text-muted">Sign in to continue your journey</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="fa-solid fa-circle-exclamation me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="fa-solid fa-envelope me-2 text-primary"></i>
              Email or Admin ID
            </label>
            <input
              className="form-control form-control-lg"
              placeholder="example@domain.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">
              <i className="fa-solid fa-lock me-2 text-primary"></i>
              Password
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

          <button className="btn btn-primary btn-login w-100" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Logging in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-right-to-bracket me-2"></i>Sign In
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <small className="text-muted">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary text-decoration-none">
              Create one
            </a>
          </small>
        </div>
      </div>
    </div>
  );
}
