import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithRedirect, GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser, login, setError, loginWithGoogle } = useAuth();
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
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  async function GoogleRedrct() {
    signInWithRedirect(auth, provider);
  }
  
  return (
    <div className="">
    <div className="">
    <div className={styles.topText}>
    <h2>Login to your account</h2>
    </div>
    <form onSubmit={handleFormSubmit}>
    <div>
    <div className={styles.inputFields}>
    <input
    id="email-address"
    name="email"
    type="email"
    autoComplete="email"
    required
    className=" px-3 py-2 border border-gray-300"
    placeholder="Email address"
    onChange={(e) => setEmail(e.target.value)}
    />
    </div>
    
    <div className={styles.inputFields}>
    <input
    id="password"
    name="password"
    type="password"
    autoComplete="current-password"
    required
    className="px-3 py-2 border border-gray-300"
    placeholder="Password"
    onChange={(e) => setPassword(e.target.value)}
    />
    </div>
    </div>
    
    <div className={styles.inputFields}>
    <button
    type="submit"
    disabled={loading}
    className="py-2 px-4 border border-transparent "
            >
              Login
            </button>
          </div>

          <div className={styles.inputFields}>
            <button
              onClick={GoogleRedrct}
              disabled={loading}
              className="py-2 px-4 border border-transparent "
            >
              Login With Google
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/register" className="text-blue-600 ">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
