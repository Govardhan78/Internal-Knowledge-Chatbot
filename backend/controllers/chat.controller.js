import { askQuestion } from "../services/chat.service.js";
import Chat from "../models/Chat.js";

export const chat = async (
  req,
  res,
  next
) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const answer = await askQuestion(message, req.user._id);

    res.status(200).json({
      success: true,
      answer,
    });
  } catch (error) {
    next(error);
  }
};

export const getChatHistory = async (req, res) => {
  const chats = await Chat.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    chats,
  });
};