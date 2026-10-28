import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running successfully on Vercel",
    status: "healthy",
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (accessible via localhost and network IP)`);
  });
}

export default app;
