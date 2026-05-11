import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const VerifyOtp = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const handleVerify = async () => {
    if (!otp) {
      setMsg("Enter OTP");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("http://localhost:3000/api/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Invalid OTP");
        setLoading(false);
        return;
      }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);

   setUser(data.user);

    if (data.user.role === "admin") {
    navigate("/user-data");
   } else {
   navigate("/dashboard");
}

    } catch {
      setMsg("Server error");
      setLoading(false);
    }
  };

  const handleResend = async () => {
  setMsg("");
  setSeconds(60);

  try {
    const res = await fetch("http://localhost:3000/api/users/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.message || "Resend failed");
      return;
    }

    setMsg("OTP resent");

  } catch {
    setMsg("Server error");
  }
};
  return (
    <div className="form-container">
      <h2>Verify OTP</h2>

      <p>OTP sent to: {email}</p>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify"}
      </button>

      {seconds > 0 ? (
        <p>Resend in {seconds}s</p>
      ) : (
        <button onClick={handleResend}>Resend OTP</button>
      )}

      {msg && <p className="error">{msg}</p>}

      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </div>
  );
};

export default VerifyOtp;