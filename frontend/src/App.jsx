import React, { useState, useEffect } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import About from "./pages/about";
import Login from "./pages/login";
import Signup from "./pages/signup";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {

    const savedData = localStorage.getItem("analysisData");

    if (savedData) {
      setAnalysisData(JSON.parse(savedData));
    }

  }, []);

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={
            <Home setAnalysisData={setAnalysisData} />
          }
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard data={analysisData} />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;