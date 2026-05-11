import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setMsg("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(
        `http://localhost:3000/api/users/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Link expired");
        setLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch {
      setMsg("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>

      {success ? (
        <p style={{ color: "green" }}>
          Password reset successful! Redirecting...
        </p>
      ) : (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {msg && (
            <p className="error">
              {msg}
              <br />
              <Link to="/forgot-password">Get new link</Link>
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default ResetPassword;