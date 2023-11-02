import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import { getChatHistory, sendMessage,getChattedUsers } from "../controllers/chat.controller.js";

const router = express.Router()

router.post("/:senderId",verifyToken,sendMessage)
router.get('/history/:senderId/:receiverId',verifyToken, getChatHistory)
router.get('/chattedusers/:senderId',verifyToken, getChattedUsers)

export default router;