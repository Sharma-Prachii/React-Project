import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    phoneNo: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const { firstName, lastName, email, password, companyName, phoneNo } = formData;

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 6 characters and include uppercase, lowercase, number, and special character";
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!phoneRegex.test(phoneNo)) {
      newErrors.phoneNo = "Phone number must be exactly 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ api: data.message || "Registration failed. Please try again." });
        setSuccess("");
        return;
      }

      setErrors({});
      setSuccess("Registration successful!");

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        companyName: '',
        phoneNo: ''
      });

    } catch (err) {
      setErrors({ api: "Server error. Please try again later." });
      setSuccess("");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Your Account</h2>

      {errors.api && <p style={{ color: "red" }}>{errors.api}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form className="form" onSubmit={handleSubmit}>

        <div className="input-group">
          <label>First Name :</label>
          <div className="input-field">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
        </div>

        <div className="input-group">
          <label>Last Name :</label>
          <div className="input-field">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
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
          <label>Company Name :</label>
          <div className="input-field">
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />
            {errors.companyName && <p className="error">{errors.companyName}</p>}
          </div>
        </div>

        <div className="input-group">
          <label>Phone Number :</label>
          <div className="input-field">
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
            />
            {errors.phoneNo && <p className="error">{errors.phoneNo}</p>}
          </div>
        </div>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;