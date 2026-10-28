import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../services/auth.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";

const ResetPassword = () => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(email, password);

      const msg = data.message || "Password reset successfully! Redirecting to login...";
      setMessage(msg);
      showSuccess(msg);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-background px-4">
  <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg">

    <h1 className="text-3xl font-bold text-center text-text-primary">
      Reset Password
    </h1>

    <p className="text-center text-text-secondary mt-2 mb-8">
      Enter your new password below.
    </p>

    {email && (
      <p className="text-center text-sm text-text-secondary mb-6">
        Resetting password for{" "}
        <span className="font-semibold text-text-primary">
          {email}
        </span>
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          New Password
        </label>

        <input
          required
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            px-4
            py-3
            border
            border-border
            rounded-lg
            bg-surface
            text-text-primary
            placeholder:text-text-muted
            focus:outline-none
            focus:ring-2
            focus:ring-border-focus
            focus:border-border-focus
          "
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Confirm Password
        </label>

        <input
          required
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="
            w-full
            px-4
            py-3
            border
            border-border
            rounded-lg
            bg-surface
            text-text-primary
            placeholder:text-text-muted
            focus:outline-none
            focus:ring-2
            focus:ring-border-focus
            focus:border-border-focus
          "
        />
      </div>

      {/* Success */}
      {message && (
        <div className="p-3 rounded-lg bg-success-light text-success text-sm">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-danger-light text-danger text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          bg-primary
          hover:bg-primary-hover
          disabled:bg-primary-light
          disabled:cursor-not-allowed
          text-text-inverse
          font-semibold
          py-3
          rounded-lg
          transition
        "
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

    </form>

    <p className="text-center text-text-secondary text-sm mt-6">
      Remember your password?{" "}
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="text-primary font-semibold hover:text-primary-hover hover:underline"
      >
        Login
      </button>
    </p>

  </div>
</div>
  );
};

export default ResetPassword;