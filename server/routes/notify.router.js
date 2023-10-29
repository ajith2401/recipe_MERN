import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import { getNotification } from "../controllers/notify.controller.js";

const router = express.Router()


router.get('/:recipientUserId',verifyToken,getNotification)

export default router

