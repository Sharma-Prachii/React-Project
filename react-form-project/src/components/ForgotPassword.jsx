import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    if (!email) {
      setMsg("Enter your email");
      return;
    }
 
    try {
      const res = await fetch("http://localhost:3000/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Error");
        return;
      }

      setMsg("Reset link generated (check console)");

    } catch {
      setMsg("Server error");
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>Send Reset Link</button>

      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPassword;