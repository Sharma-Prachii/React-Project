import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();   

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });

    setErrors(prev => ({
      ...prev,
      [name]: "",
      api: ""
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  const validationErrors = validateForm();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setSuccess("");
    return;
  }

  setLoading(true);
  setErrors({});
  setSuccess("");

  try {    
    const loginRes = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      setErrors({ api: loginData.message || "Invalid email or password" });
      return;
    }
    localStorage.setItem("token", loginData.token);

  localStorage.setItem(
  "user",
  JSON.stringify(loginData.user)
  );

    const otpRes = await fetch("http://localhost:3000/api/users/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: formData.email })
    });

    const otpData = await otpRes.json();

    if (!otpRes.ok) {
      setErrors({ api: otpData.message || "Failed to send OTP" });
      return;
    }

    setSuccess("OTP sent to your email");

    setTimeout(() => {
      navigate("/verify-otp", {
        state: { email: formData.email }
      });
    }, 500);

  } catch (error){
    setErrors({ api: error.message || "Server error" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="form-container">
      <h2>Login</h2>

      {errors.api && <p className="error">{errors.api}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>} 

      <form className="form" onSubmit={handleSubmit} noValidate>
        
        <div className="input-group">
          <label>Email :</label>

          <div className="input-field">
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
        </div>

        <div className="input-group">
          <label>Password :</label>

          <div className="input-field">
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="forgot-password">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>

      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default Login;