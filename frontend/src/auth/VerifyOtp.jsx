import React, { useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { verifyOtp, resendOtp } from "../services/auth.js";
import { useSnackbar } from "../context/SnackbarContext.jsx";

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

    const { showSuccess, showError } = useSnackbar();

  // 1. Handle Single Digit or Multi-digit Paste in input
  const handleChange = (e, index) => {
    const rawVal = e.target.value.replace(/\D/g, "");

    if (!rawVal) {
      const nextOtp = [...otpValues];
      nextOtp[index] = "";
      setOtpValues(nextOtp);
      return;
    }

    if (rawVal.length > 1) {
      const digits = rawVal.slice(0, 6).split("");
      const nextOtp = [...otpValues];
      digits.forEach((char, i) => {
        if (i < 6) nextOtp[i] = char;
      });
      setOtpValues(nextOtp);
      const focusTarget = Math.min(digits.length, 5);
      inputRefs.current[focusTarget]?.focus();
      return;
    }

    const nextOtp = [...otpValues];
    nextOtp[index] = rawVal;
    setOtpValues(nextOtp);

    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // 2. Handle Backspace & Arrow Navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const nextOtp = [...otpValues];

      if (otpValues[index]) {
        nextOtp[index] = "";
        setOtpValues(nextOtp);
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (index > 0) {
        nextOtp[index - 1] = "";
        setOtpValues(nextOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 3. Handle Full Clipboard Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const clip = e.clipboardData || window.clipboardData;
    if (!clip) return;
    const pastedData = clip.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedData) return;

    const digits = pastedData.split("");
    const nextOtp = ["", "", "", "", "", ""];
    digits.forEach((char, i) => {
      if (i < 6) nextOtp[i] = char;
    });
    setOtpValues(nextOtp);

    const focusTarget = Math.min(digits.length, 5);
    inputRefs.current[focusTarget]?.focus();
  };

  // 4. Submit Verification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (fullOtp.length !== 6) {
      const msg = "Please enter a complete 6-digit OTP";
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOtp(email, fullOtp);
      const msg = data.message || "OTP verified successfully";
      setMessage(msg);
      showSuccess(msg);

      navigate("/reset-password", {
        state: { email },
      });
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Invalid or expired OTP. Please try again.";
      setError(errMsg);
      showError(errMsg);
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
      const msg = data.message || "A new OTP has been sent to your email";
      setMessage(msg);
      showSuccess(msg);
      setOtpValues(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const errMsg = err.response?.data?.message || "Failed to resend OTP";
      setError(errMsg);
      showError(errMsg);
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
            onClick={() => navigate(-1)}
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
                  maxLength={6}
                  onFocus={(e) => e.target.select()}
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
