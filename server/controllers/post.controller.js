import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req,res,next) =>{
    try {

        const {authorId, title, description,ingredients,instructions,image} = req.body;
        const authorDetais = await User.findById(authorId)
        const newPost  = new Post({
            title, 
            description,
            ingredients,
            instructions,
            image,
            authorId,  
            authorName:authorDetais.firstName + authorDetais?.lastName,
            authorAvatar : authorDetais.avatar,
            likes: new Map(),
            comments : [] 
        })

       await newPost.save()
       const post = await Post.find()
       res.status(201).json(post)
        
    } catch (error) {
        next(errorHandler(500, error.message))
        
    }

}


export const getFeedPosts = async (req,res,next) =>{
    try {
         const posts =await Post.find()
         res.status(200).json(posts)
        
    } catch (error) {
        next(errorHandler(404,error.message))
        
    }
    
}

export const getUserPosts = async(req,res,next) =>{

    try {
        const {userId} = req.params;
        const userPosts =await Post.find({ authorId: userId })
         res.status(200).json(userPosts) 
    } catch (error) {
        next(errorHandler(404,error.message))
    }
    
}

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(postId);

    if (!post.likes) {
      post.likes = new Set();
    }
    if (post.likes.has(userId)) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

  
  


export const addComment  =async (req,res,next) =>{
    try {
        const {id} = req.params;
        const {comment, userId} = req.body;
        const newComment = {
            text : comment,
            authorId : userId
        }
        const post = await Post.findById(id)
        if (!post) {
            return next(errorHandler(404, "Post not found"));
          }
          post.comments.push(newComment)
          await post.save();
          res.status(201).json({ message: 'Comment added to the post', comment: newComment });
        }
     catch (error) {
        next(errorHandler(500,error.message))
        
    }
}
