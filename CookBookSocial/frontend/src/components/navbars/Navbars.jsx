import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbars.module.css";

export default function Navbars() {

  const { currentUser, setError, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const username = currentUser.displayName;

  async function handleLogout() {
    try {
      setError("");
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to logout");
    }
  }

  return (
    // Navbar object wrapper as a whole
    <>
      {currentUser && (
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/home">CookBook Social</Navbar.Brand>
            <div className={styles.usernameText}>
              Hello {username ? username : "No username"}
            </div>
            <img
              src={currentUser.photoURL}
              className={styles.profilePic}
              alt="No-Pic"
            />
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {/* Setting links for navbar */}
                <Nav.Link href="/home">Home</Nav.Link>
                <Nav.Link href="profile">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}
