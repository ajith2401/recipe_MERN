import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3 // Use 'minlength' to specify the minimum length
    },
    lastName: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: 8 // Use 'minlength' to specify the minimum length
    },
    emailOrPhnum: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });


const User = mongoose.model("user",userSchema)

export default User;

