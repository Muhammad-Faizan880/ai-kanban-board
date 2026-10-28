import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"TaskFlow" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email delivered successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.warn("==================================================");
    console.warn("⚠️ [SMTP NOTICE] Google Gmail rejected credentials:", error.message);
    console.log("💡 [DEV SMART FALLBACK] Email failed, but active OTP was saved in DB and printed above for testing.");
    console.warn("==================================================");
    return { success: false, error: error.message };
  }
};
