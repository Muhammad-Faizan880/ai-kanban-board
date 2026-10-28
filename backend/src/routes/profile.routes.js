import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import { protect } from "../middleware/protect.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;