import express from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "muhammadfaizancodendcoffee@gmail.com",
      subject: "MERN Auth Test",
      html: "<h1>Email is working!</h1>",
    });

    res.status(200).json({
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("EMAIL TEST ERROR:", error);

    res.status(500).json({
      message: "Failed to send test email",
      error: error.message,
    });
  }
});

export default router;