import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordOtpVerified = false;

    await user.save();

    console.log("==========================================");
    console.log("🔑 PASSWORD RESET OTP: [", otp, "]");
    console.log("==========================================");
    console.log("OTP EXPIRY:", user.resetPasswordOtpExpire);

    // Send OTP email
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 30px;
        ">
          <h2>Reset Your Password</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your password.
            Use the OTP below to continue:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            margin: 30px 0;
            color: #2563eb;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you didn't request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });

    res.status(200).json({
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Failed to process forgot password",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    user.resetPasswordOtpVerified = true;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    res.status(500).json({
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate new 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP + expiry
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;
    user.resetPasswordOtpVerified = false;

    await user.save();

    // Send new OTP
  // Send new OTP
await sendEmail({
  to: user.email,
  subject: "Your Password Reset OTP",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
      <h2 style="color: #2563eb;">Password Reset OTP</h2>

      <p>Your password reset OTP is:</p>

      <div style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 8px;
        color: #0f172a;
        margin: 20px 0;
      ">
        ${otp}
      </div>

      <p>This OTP will expire in <strong>10 minutes</strong>.</p>

      <p style="color: #64748b;">
        If you didn't request a password reset, you can safely ignore this email.
      </p>
    </div>
  `,
});

    res.status(200).json({
      message: "A new OTP has been sent to your email",
    });
  } catch (error) {
    console.error("RESEND OTP ERROR:", error);

    res.status(500).json({
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtpVerified: true,
      resetPasswordOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "OTP verification required or expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    user.resetPasswordOtpVerified = false;

    await user.save();

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};