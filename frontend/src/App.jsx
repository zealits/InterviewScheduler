import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./components/AdminDashboard";
import InterviewerDetails from "./components/InterviewerDetails";
import { ProtectedRoute, ProtectedRouteUser } from "./routes/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import RegisterUser from "./pages/UserLogin/Register";
import LoginUser from "./pages/UserLogin/Login";
import UserDashboard from "./components/UserDashboard";
import Availibility from "./components/Availibility";
import UpcomingInterviews from "./components/UpcomingInterviews";
import ProfileUpdate from "./components/UserDashboard/ProfileUpdate";
import PendingApprovals from "./components/UserDashboard/PendingApprovals";
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/register" element={<RegisterUser />} />
          <Route path="/user/login" element={<LoginUser />} />

          {/* Protected Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRouteUser>
                <UserDashboard />
              </ProtectedRouteUser>
            }
          >
            {/* Nested Routes for User Dashboard */}
            <Route path="availability" element={<Availibility />} />
            <Route path="upcoming-interviews" element={<UpcomingInterviews />} />
            <Route path="profile-update" element={<ProfileUpdate />} />
            <Route path="pending-approvals" element={<PendingApprovals />} />
            <Route
              path="logout"
              element={<div>You have been logged out. Redirecting...</div>}

            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail"
            element={
              <ProtectedRoute>
                <InterviewerDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
