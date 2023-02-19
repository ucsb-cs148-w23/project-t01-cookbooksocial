import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "./PasswordReset.css";

const auth = getAuth();

function PasswordReset() {
  const [email, setEmail] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setShowBanner(true);
        const interval = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        setTimeout(() => {
          clearInterval(interval);
          window.location.href = "/login";
        }, 5000);
      })
      .catch((error) => {
        console.error(error);
        if (error.code === "auth/user-not-found") {
          setShowError(true);
        }
      });
  };

  return (
    <div className="container">
      <div className="form-box">
        <h1>Password Reset</h1>
        <form onSubmit={handleSubmit}>
          <label>
            
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInput={() => setShowError(false)}
            />
          </label>
          <br />
          <br />
          <button type="submit">Submit</button>
        </form>
        {showBanner && (
          <div className="banner">
            <p>
              Password reset email sent. Redirecting to login page.
            </p>
          </div>
        )}
        {showError && (
          <div className="error">
            <p>Email not found. Please check your email address and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordReset;
