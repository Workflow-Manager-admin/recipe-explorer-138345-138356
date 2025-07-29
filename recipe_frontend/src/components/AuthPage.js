import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AuthPage({ mode = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [alert, setAlert] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useUser();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setAlert("");
    (mode === "login"
      ? login(email, password)
      : register(email, password, fullName)
    )
      .then(() => navigate("/"))
      .catch((e) => setAlert(e.message))
      .finally(() => setLoading(false));
  }

  return (
    <div className="form-box">
      <h2 style={{ textAlign: "center" }}>
        {mode === "login" ? "Sign In" : "Register"}
      </h2>
      <form onSubmit={handleSubmit}>
        {alert && <div className="alert">{alert}</div>}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {mode === "register" && (
          <>
            <label htmlFor="fullname">Full Name (optional)</label>
            <input
              id="fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </>
        )}
        <label htmlFor="password">Password {mode === "register" && <span style={{ fontSize: "0.82em" }}> (min 6 chars)</span>}</label>
        <input
          id="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={6}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn" disabled={loading}>
          {loading ? "..." : mode === "login" ? "Log In" : "Register"}
        </button>
      </form>
      <div style={{ marginTop: 18, textAlign: "center", fontSize: "0.96em" }}>
        {mode === "login" ? (
          <>
            Need an account?{" "}
            <a href="/register" onClick={(e) => {e.preventDefault();navigate("/register");}}>Register</a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/login" onClick={(e) => {e.preventDefault();navigate("/login");}}>Sign in</a>
          </>
        )}
      </div>
    </div>
  );
}
