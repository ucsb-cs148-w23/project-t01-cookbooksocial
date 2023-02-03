import "./App.css";

import React from "react";

import { Route, Routes, redirect, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Signup from "./pages/SignupPage/Signup";
import Login from "./pages/LoginPage/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Testpage from "./pages/TestPage/TestPage";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import ProfilePic from "./pages/ProfilePicPage/ProfilePic";
import WithPrivateRoute from "./utils/WithPrivateRoute";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ErrorMessage />
        <Routes>
          <Route exact path="/login" element={<Login />} />

          <Route
            exact
            path="/home"
            element={
              <WithPrivateRoute>
                <HomePage />
              </WithPrivateRoute>
            }
          />

          <Route exact path="/register" element={<Signup />} />

          <Route exact path="/test" element={<Testpage />} />
          <Route
            exact
            path="/profile"
            element={
              // This adds private routing
              <WithPrivateRoute>
                <ProfilePic />
              </WithPrivateRoute>
            }
          />

          {/* This route is a "wilcard", if someone tries to access a non defined route, they will be redirected to home route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
