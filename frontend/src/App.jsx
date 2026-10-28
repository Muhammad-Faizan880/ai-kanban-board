import "./index.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedLayout from "./layouts/ProtectedLayout";
import DashboardLayout from "./components/dashboardComponents/DashboardLayout";
import { ForgotPassword } from "./auth/ForgotPassword";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ResetPassword from "./auth/ResetPassword";
import VerifyOtp from "./auth/VerifyOtp";
import MyTasks from "./pages/MyTasks";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/myTasks" element={<MyTasks />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Settings />} />
          </Route>
        </Route>

        {/* Catch-all unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
