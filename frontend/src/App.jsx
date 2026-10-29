import React, { lazy, Suspense } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SnackbarProvider } from "./context/SnackbarContext";

// Immediate load landing page for instant 100% Lighthouse score
import Home from "./pages/Home";

// Lazy-load other routes on demand
const Login = lazy(() => import("./auth/Login"));
const Register = lazy(() => import("./auth/Register"));
const ForgotPassword = lazy(() =>
  import("./auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword }))
);
const VerifyOtp = lazy(() => import("./auth/VerifyOtp"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));

const ProtectedLayout = lazy(() => import("./layouts/ProtectedLayout"));
const DashboardLayout = lazy(() =>
  import("./components/dashboardComponents/DashboardLayout")
);
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MyTasks = lazy(() => import("./pages/MyTasks"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Settings = lazy(() => import("./pages/Settings"));

const PageLoader = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-background">
    <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
