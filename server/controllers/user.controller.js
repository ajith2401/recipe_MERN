import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs"

export const test = (req,res) =>{
    res.json({
        message: "hello world"
    });
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only update your own account"));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const userId = req.params.id;

        // Update user details
        const updateUserDetails = await User.findByIdAndUpdate(userId, {
            $set: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                emailOrPhoneNumber: req.body.emailOrPhoneNumber,
                location: req.body.location,
                occupation: req.body.occupation,
                twitter: req.body.twitter,
                linkedIn: req.body.linkedIn,
                password: req.body.password,
                avatar: req.body.avatar,
            },
        }, { new: true });
         const fullName = updateUserDetails._doc.firstName +( updateUserDetails._doc.lastName || "");
         const authorAvatar = updateUserDetails._doc.avatar;
        // Update user's posts
        await Post.updateMany({ authorId: userId }, {
            $set: {
                authorName: fullName, // Handle optional lastName
                authorAvatar: authorAvatar,
            },
        }, { new: true });

        const { password, ...rest } = updateUserDetails._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account."));
    }  
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token");
        res.status(200).json({
            message: "Account deleted successfully"
        });
    } catch (error) {
        next(errorHandler(500, "Error deleting the account."));
    }
};


export const getUser = async (req,res,next) =>{
    try {
        const id = req.params.id;
        const user = await User.findById(id)
        const {password,...restUSer} = user._doc 
        res.status(200).json(restUSer)
        
    } catch (error) {
        next(errorHandler(500,"cannot find the user"))
        
    }

}

export const getFriends = async (req,res,next) =>{
    try {
        const id = req.params.id;
        const user = await User.findById(id)
        const friendsList =  await Promise.all(
            user.friends.map((id)=> User.findById(id))
        )
        if (friendsList.length !== 0){
             const formattedFriendsList = friendsList.map(({_id,firstName,lastName,occupation,location,avatar})=>
        {return {_id,firstName,lastName,occupation,location,avatar} })
        res.status(200).json(formattedFriendsList)
        }
        else{ 
            res.status(200).json("no friends available")
        }
       
    } catch (error) {
        next(errorHandler(500,"cannot find the user"))  
    }

}

export const addOrRemoveFriend = async (req,res,next) =>{
    try {
        const {id , friendId} = req.params;
        const user =await User.findById(id);
        const friend =await User.findById(friendId)
        
        if (user.friends.includes(friendId)){
            user.friends = user.friends.filter((id)=> id !== friendId)
            friend.friends = friend.friends.filter((id)=> id !== id)
        }
        else{
            user.friends.push(friendId)
            friend.friends.push(id)
        }
        await user.save()
        await friend.save()
        const friendsList = await Promise.all(
            user.friends.map((id)=> User.findById(id))
         )
         const formattedFriendsList = friendsList.map(({ _id, firstName, lastName, occupation, location, avatar }) => {
            const isLastName = lastName ? lastName : " ";
            return { _id, firstName, isLastName, occupation, location, avatar };
          });

        res.status(200).json(formattedFriendsList)
    } catch (error) {
        next(errorHandler(404,"cannot add friend "))  
    }

}


