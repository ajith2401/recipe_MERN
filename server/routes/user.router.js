import express from "express";
import { test ,updateUser,deleteUser ,getUser,getFriends,addOrRemoveFriend} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router()

router.get('/test', test)
router.post('/update/:id',verifyToken, updateUser)
router.delete('/delete/:id',verifyToken, deleteUser)

router.get("/:id",verifyToken,getUser)
router.get("/:id/friends",verifyToken,getFriends)
router.patch("/:id/:friendId",verifyToken,addOrRemoveFriend)

export default router;