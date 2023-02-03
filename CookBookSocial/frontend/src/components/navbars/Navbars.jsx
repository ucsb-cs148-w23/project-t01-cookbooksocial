import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import auth from "../../config/firebase";

import { useAuth } from "../../contexts/AuthContext";
import styles from "./Navbars.module.css";

export default function Navbars() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await fetch("http://localhost:3001", payloadHeader);
        console.log(await res.text());
        console.log("Verification done");
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

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
              {" "}
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
                <Navbar.Text onClick={handleLogout}>Logout</Navbar.Text>

                {/* Dropdown customization */}
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}
