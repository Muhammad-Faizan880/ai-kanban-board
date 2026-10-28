
import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;

    await user.save();

    const updatedUser = await User.findById(req.user.userId).select(
      "-password -resetPasswordOtp -resetPasswordOtpExpire -resetPasswordOtpVerified"
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    // Duplicate username/email
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];

      return res.status(400).json({
        message: `${field} already exists`,
      });
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((err) => err.message)
          .join(", "),
      });
    }

    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};