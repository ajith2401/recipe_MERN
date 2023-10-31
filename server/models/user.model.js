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
    },
    avatar:{
        type : String,
        default :"https://static.vecteezy.com/ti/vecteur-libre/p3/21548095-defaut-profil-image-avatar-utilisateur-avatar-icone-la-personne-icone-tete-icone-profil-image-icones-defaut-anonyme-utilisateur-masculin-et-femelle-homme-d-affaire-photo-espace-reserve-social-reseau-avatar-portrait-gratuit-vectoriel.jpg"
    },
    friends :{
        type :Array,
        default : []
    },
    bio: {
        type: String,
      },
    recipes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post', // Referencing the Post model
        },
      ],
    followers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Referencing other users who follow this user
        },
      ],
    following: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // Referencing users whom this user follows
        },
      ],
     location : String,
     occupation:String,
     twitter : String,
     linkedIn :String,
     viewedProfile: Number,
     impressions: Number
}, { timestamps: true });


const User = mongoose.model("User",userSchema)

export default User;

