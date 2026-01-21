import React, { useState, useEffect } from "react";
import { useStore } from "../store/context";
import { login } from "../store/action";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { state, dispatch } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (state.user) {
      navigate(
        state.user.role === "admin"
          ? "/admin/dashboard"
          : "/employee/dashboard"
      );
    }
  }, [state.user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Make the POST request to backend
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      // Destructure token and user from response
      const { token, user } = response.data;

      // Save token to localStorage
      localStorage.setItem("token", token);

      // Update global state
      dispatch(login(user));

      // Redirect based on role or previous page
      const from =
        location.state?.from ||
        (user.role === "ADMIN" ? "/admin/dashboard" : "/employee/dashboard");
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to login. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="col-md-6 col-lg-4 mx-auto mt-5 p-4"
      style={{
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 className="text-center mb-4" style={{ color: "#2E7D32" }}>
        Login to EMS
      </h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-muted">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="form-control form-control-lg"
            style={{
              borderColor: "#4CAF50",
              borderRadius: "8px",
              padding: "12px 15px",
              fontSize: "1rem",
            }}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="form-label text-muted">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="form-control form-control-lg"
            style={{
              borderColor: "#4CAF50",
              borderRadius: "8px",
              padding: "12px 15px",
              fontSize: "1rem",
            }}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="d-grid mb-3">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            style={{
              backgroundColor: "#4CAF50",
              border: "none",
              padding: "12px 0",
              fontWeight: "600",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              fontSize: "0.95rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

      </form>
    </div>
  );

}
