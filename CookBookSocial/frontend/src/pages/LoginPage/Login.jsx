import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const { currentUser, login, setError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    currentUser && navigate("/home");
  }, [currentUser, navigate]);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/home");
    } catch (e) {
      setError("Failed to login");
    }
    setLoading(false);
  };

  const GoogleRedirect = () => signInWithRedirect(auth, provider);

  return (
    <div className={styles.container}>
      <div className={styles.rectangle}>
        <div className={styles.topText}>
          <h2>Login to your account</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div>
            <div className={styles.inputFields}>
              <label htmlFor="email-address"> </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email Address"
                required
                className={styles.input}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputFields}>
              <label htmlFor="password"></label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="password"
                autoComplete="current-password"
                required
                className={styles.input}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.inputFields}>
            <button
              type="submit"
              disabled={loading}
              className={styles.button}
            >
              Login
            </button>
          </div>
        </form>

        <div className={styles.inputFields}>
          <div className={styles.orText}>Or sign in with:</div>
          <button
            onClick={GoogleRedirect}
            disabled={loading}
            className={styles.googleButton}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className={styles.googleIcon} />
          </button>
        </div>
        <div className="flex items-center justify-between"></div>
        <div className="text-sm">
            <Link to="/password-reset" className="text-blue-600">
              Forgot Password?
            </Link>
          </div>
          
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link to="/register" className="text-blue-600">
              Don't have an account? Register
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
