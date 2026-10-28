import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../services/auth.js";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp(email, otp);

      console.log("OTP verified:", data);

      setMessage(data.message);

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
  try {
    setResending(true);
    setMessage("");
    setError("");

    const data = await resendOtp(email);

    setMessage(data.message);

    // Clear old OTP
    setOtp("");
  } catch (error) {
    setError(
      error.response?.data?.message || "Failed to resend OTP"
    );
  } finally {
    setResending(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
  <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg">

    {/* Heading */}
    <h1 className="text-3xl font-bold text-center text-text-primary">
      Verify Your Email
    </h1>

    <p className="text-center text-text-secondary mt-2 mb-8">
      Enter the 6-digit OTP sent to your email.
    </p>

    {/* Email */}
    {email && (
      <p className="text-center text-sm text-text-secondary mb-6">
        Code sent to{" "}
        <span className="font-semibold text-text-primary">
          {email}
        </span>
      </p>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* OTP */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3 text-center">
          Verification Code
        </label>

        <div className="flex justify-center gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={otp[index] || ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                if (!value) return;

                const newOtp = otp.split("");
                newOtp[index] = value;
                setOtp(newOtp.join(""));

                // Move to next box
                const nextInput = e.target.nextElementSibling;
                if (nextInput) {
                  nextInput.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !otp[index]) {
                  const previousInput = e.target.previousElementSibling;

                  if (previousInput) {
                    previousInput.focus();
                  }
                }
              }}
              className="
                w-11
                h-12
                sm:w-12
                sm:h-14
                text-center
                text-xl
                font-semibold
                text-text-primary
                bg-surface
                border
                border-border
                rounded-lg
                outline-none
                transition
                focus:border-border-focus
                focus:ring-2
                focus:ring-border-focus/20
              "
            />
          ))}
        </div>
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

      {/* Verify Button */}
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
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
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>

    {/* Back */}
    <p className="text-center text-text-secondary text-sm mt-6">
      Didn't receive the code?{" "}
      <button
  type="button"
  onClick={handleResendOtp}
  disabled={resending}
  className="text-primary font-semibold hover:text-primary-hover hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
>
  {resending ? "Sending..." : "Resend OTP"}
</button>
    </p>

  </div>
</div>
  );
};

export default VerifyOtp;