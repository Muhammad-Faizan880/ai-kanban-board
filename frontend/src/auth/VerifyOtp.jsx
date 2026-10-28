import React, { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { verifyOtp, resendOtp } from "../services/auth.js";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  // 6 separate box states for reliable per-box control
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // Full joined OTP string
  const fullOtp = otpValues.join("");

  // 1. Handle Single Digit Input
  const handleChange = (e, index) => {
    const val = e.target.value.replace(/\D/g, "");

    // If empty (e.g. user selected and hit backspace or clear)
    if (!val) {
      const nextOtp = [...otpValues];
      nextOtp[index] = "";
      setOtpValues(nextOtp);
      return;
    }

    // Take the last character typed in case multiple were entered
    const char = val.slice(-1);
    const nextOtp = [...otpValues];
    nextOtp[index] = char;
    setOtpValues(nextOtp);

    // Auto-focus next input box
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 2. Handle Backspace & Arrow Key Navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const nextOtp = [...otpValues];

      // If current box has a value, clear it and stay or move
      if (otpValues[index]) {
        nextOtp[index] = "";
        setOtpValues(nextOtp);
      } else if (index > 0) {
        // If current box is already empty, move to previous box and clear it
        nextOtp[index - 1] = "";
        setOtpValues(nextOtp);
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 3. Handle Full Paste Event (e.g. copying 6-digit OTP from terminal/email)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pastedData) return;

    const nextOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      nextOtp[i] = pastedData[i] || "";
    }
    setOtpValues(nextOtp);

    // Focus the next empty box or the last box
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  // 4. Submit Verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (fullOtp.length !== 6) {
      setError("Please enter a complete 6-digit OTP");
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp(email, fullOtp);
      setMessage(data.message || "OTP verified successfully");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 5. Resend OTP
  const handleResendOtp = async () => {
    try {
      setResending(true);
      setMessage("");
      setError("");

      const data = await resendOtp(email);
      setMessage(data.message || "A new OTP has been generated");
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-2xl shadow-lg border border-border">
        {/* Back Link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>Change Email / Back</span>
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-text-primary">
          Verify Your Email
        </h1>

        <p className="text-center text-text-secondary mt-2 mb-6 text-sm">
          Enter the 6-digit OTP sent to your email.
        </p>

        {/* Email badge */}
        {email && (
          <div className="text-center text-xs text-text-secondary mb-6 bg-surface-muted rounded-xl py-2 px-3">
            Code sent to{" "}
            <span className="font-semibold text-text-primary">{email}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input Boxes */}
          <div>
        

            <div className="flex justify-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-text-primary bg-surface border border-border rounded-xl outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          {message && (
            <div className="p-3 rounded-xl bg-success-light text-success text-xs font-medium text-center">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-danger-light text-danger text-xs font-medium text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || fullOtp.length !== 6}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-inverse font-semibold py-3 rounded-xl shadow-xs transition active:scale-[0.99]"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend Action */}
        <p className="text-center text-text-secondary text-xs mt-6">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="text-primary font-semibold hover:text-primary-hover hover:underline disabled:opacity-50 cursor-pointer"
          >
            {resending ? "Sending new code..." : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
