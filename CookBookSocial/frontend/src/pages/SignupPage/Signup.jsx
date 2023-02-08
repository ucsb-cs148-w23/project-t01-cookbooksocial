import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';

import styles from "./Signup.module.css"

export default function Signup() {
  const navigate = useNavigate();
  const { currentUser, register, setError } = useAuth();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match"); // Replace the alert with this
    }

    try {
      setError(""); // Remove error when trying to register
      setLoading(true);
      await register(email, password);
      navigate("/profile");
    } catch (e) {
      let errorMessage = e.code
      if (errorMessage === "auth/weak-password") {
        setError("The password is too weak.");
      }
      else {
        console.log("This happened")
        setError(errorMessage); // Replace the alert with this
      }
      navigate("/register");
    }

    setLoading(false);
  }

  return (
    <div>
      <div>
        <div className={styles.topText}>
          <h2>Register your account</h2>
        </div>

        <Form onSubmit={handleFormSubmit}>

          <div className={styles.emailBox}>
            <Form.Group className="mb-3" controlId="email-address">
              <Form.Label>Email address</Form.Label>

              <div className={styles.inputFields}>
                <Form.Control
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter email"
                  className=" px-3 py-2 border border-gray-300"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

          </div>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <div className={styles.inputFields}>
              <Form.Control
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="px-3 py-2 border border-gray-300"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <div className={styles.inputFields}>
              <Form.Control
                name="confirmPassword"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 placeholder-gray-500 rounded-t-md bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

          </Form.Group>

          <div className={styles.inputFields}>
            <button
              type="submit"
              disabled={loading}
              className="py-2 px-4 border border-transparent "
            >
              Register
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/login"
                className="text-blue-600"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>

        </Form>


      </div>
    </div>
  );
}
