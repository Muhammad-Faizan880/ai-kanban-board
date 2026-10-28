import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  generateAITaskBreakdown,
} from "../controllers/task.controller.js";
import { protect } from "../middleware/protect.middleware.js";

const router = express.Router();

// All task routes require authentication
router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.post("/ai-breakdown", generateAITaskBreakdown);
router.put("/:id", updateTask);
router.put("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

export default router;

