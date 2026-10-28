import React, { useState } from "react";
import { forgotPassword } from "../services/auth.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const { showSuccess, showError } = useSnackbar();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await forgotPassword(email);
console.log("data>>>", data);
      const msg = data.message || "Reset OTP sent to your email";
      setMessage(msg);
      showSuccess(msg);
      navigate("/verify-otp",{
  state: { email }
});
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

    {/* Heading */}
    <h1 className="text-3xl font-bold text-center text-text-primary">
      Forgot Password?
    </h1>

    <p className="text-center text-text-secondary mt-2 mb-8">
      Enter your email and we'll send you a password reset link.
    </p>

    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Email
        </label>

        <input
          required
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

      {/* Success Message */}
      {message && (
        <div className="
          p-3
          rounded-lg
          bg-success-light
          text-success
          text-sm
        ">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="
          p-3
          rounded-lg
          bg-danger-light
          text-danger
          text-sm
        ">
          {error}
        </div>
      )}

      {/* Button */}
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
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

    </form>

    {/* Back to Login */}
    <p className="text-center text-text-secondary text-sm mt-6">
      Remember your password?{" "}
      <Link
        to="/login"
        className="text-primary font-semibold hover:text-primary-hover hover:underline"
      >
        Login
      </Link>
    </p>

  </div>
</div>
  );
};