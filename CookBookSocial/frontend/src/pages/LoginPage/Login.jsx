import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';



import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser, login, setError } = useAuth();

  useEffect(() => {
    if (currentUser) {
      console.log("User detected")
      navigate("/home");
    }
  }, [currentUser, navigate]);

  async function handleFormSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/home");
    } catch (e) {
      setError("Failed to login");
    }

    setLoading(false);
  }

  return (
    <div className="">
      <div className="">
        <div className={styles.topText}>
          <h2>Login to your account</h2>
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


          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 border border-transparent mb-3 mt-3"
          >
            Login
          </button>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/register" className="text-blue-600 ">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
