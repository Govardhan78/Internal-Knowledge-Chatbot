import express from "express";
import { chat, getChatHistory } from "../controllers/chat.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, chat);
router.get("/history", protect, getChatHistory);

export default router;
