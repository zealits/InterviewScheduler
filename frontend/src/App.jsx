import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./components/AdminDashboard";
import Form from "./components/Form";
import SlotDetail from "./components/SlotDetails";
import InterviwerDetails from "./components/InterviewerDetails";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import RegisterUser from "./pages/UserLogin/Register";
import LoginUser from "./pages/UserLogin/Login";
import UserDashboard from "./components/UserDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={ < Register /> } />
          <Route path="/login" element={<Login />} />
          <Route path="/user/register" element={ <RegisterUser /> } />
          <Route path="/user/login" element={<LoginUser />} />
          <Route path="/user/dashboard" element={<UserDashboard/>} />

          {/* Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <Form />
              </ProtectedRoute>
            }
          />
          <Route
            path="/slot"
            element={
              <ProtectedRoute>
                <SlotDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail"
            element={
              <ProtectedRoute>
                <InterviwerDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
