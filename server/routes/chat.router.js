import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import { getChatHistory, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router()

router.post("/:senderId",verifyToken,sendMessage)
router.get('/history/:senderId/:receiverId',verifyToken, getChatHistory)

export default router;