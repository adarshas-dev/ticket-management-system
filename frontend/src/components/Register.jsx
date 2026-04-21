import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  //validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (password) =>
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isValidPassword(password)) {
      newErrors.password = "Min 6 chars, include uppercase, lowercase & number";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed";

      toast.error(msg);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light login-bg">
      <div className="card shadow p-4" style={{ width: "24rem" }}>
        <h4 className="text-center mb-4">Hello, Welcome</h4>

        <form onSubmit={handleSubmit}>
          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name && (
              <small className="text-danger">{errors.name}</small>
            )}
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
              }}
            />
            {errors.email && (
              <small className="text-danger">{errors.email}</small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Password</label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Create password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors({ ...errors, password: "" });
                }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                ></i>
              </button>
            </div>

            {errors.password && (
              <small className="text-danger">{errors.password}</small>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>

            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({ ...errors, confirmPassword: "" });
                }}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`bi ${
                    showConfirmPassword ? "bi-eye" : "bi-eye-slash"
                  }`}
                ></i>
              </button>
            </div>

            {errors.confirmPassword && (
              <small className="text-danger">{errors.confirmPassword}</small>
            )}
          </div>

          <button type="submit" className="btn btn-pink w-100 mt-2 text-white">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
