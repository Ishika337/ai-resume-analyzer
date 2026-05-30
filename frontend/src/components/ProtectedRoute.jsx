import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    // Agar login nahi hai, toh redirect to login
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;