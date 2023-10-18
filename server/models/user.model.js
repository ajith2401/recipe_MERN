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
    emailOrPhoneNumber: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });


const User = mongoose.model("user",userSchema)

export default User;

