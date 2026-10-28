import express from "express";
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/tasks", taskRoutes);

export default app;
