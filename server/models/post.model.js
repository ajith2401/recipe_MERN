import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  ingredients: {
    type: [String],
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String, // You can store the image URL
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User who authored the post
  },
  authorName: {
    type: String,
    required:true, // Reference to the User who authored the post
  },
  authorAvatar: {
    type : String,
    default :"https://static.vecteezy.com/ti/vecteur-libre/p3/21548095-defaut-profil-image-avatar-utilisateur-avatar-icone-la-personne-icone-tete-icone-profil-image-icones-defaut-anonyme-utilisateur-masculin-et-femelle-homme-d-affaire-photo-espace-reserve-social-reseau-avatar-portrait-gratuit-vectoriel.jpg"
},
likes: {
  type: Map,
  of: Boolean,
  default: new Map(),
},
  comments: [
    {
      text: String,
      authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Users who commented on the post
      },
      commetUserName : {
        type: String,
      },
      commetUserAvatar:{
        type: String, 
      }
    },
  ],
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
