import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import {createPost,getFeedPosts,getUserPosts,likePost,addComment} from "../controllers/post.controller.js"

const router = express.Router()


router.get('/posts',verifyToken, getFeedPosts)
router.get("/:userId/posts",verifyToken,getUserPosts)

router.patch("/:postId/like",verifyToken,likePost)
router.post("/createpost", verifyToken, createPost)

router.patch("/:postId/comment",verifyToken,addComment)

 export default router; 