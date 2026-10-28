import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "API is running successfully",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});