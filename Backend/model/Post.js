const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
  caption: String,
  image: {
    // cludinary me public id deta hai aur uska url islie lenge
    public_id: String,
    url: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});
const Post = mongoose.model("postSchema", postSchema);
module.exports = Post;
