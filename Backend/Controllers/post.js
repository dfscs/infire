const Post = require("../model/Post");
const User = require("../model/User");
const Cloudinary = require("../Config/Cloudinary");
const { compareSync } = require("bcrypt");
module.exports.upload_controller = async (req, res, next) => {
  try {
    const { id, caption } = req.body;
    const { path } = req.file;
    //  console.log(id)
    // console.log(req.body.caption);
    const image = await Cloudinary.uploader.upload(path, {
      folder: "post",
      use_filename: true,
    });
    const user = await User.findById(id);

    const newPost = {
      caption: req.body.caption,
      image: {
        public_id: image.public_id,
        url: image.url,
      },
      owner: id,
    };

    const postCreate = await Post.create(newPost); // new post bn rha return krega post detail

    user.local.posts.push(postCreate._id);

    await user.save();

    res.status(201).json({
      success: true,
      message: "Post Created",
    });
  } catch (err) {
    console.log(err);
  }
};

// Delete Post

module.exports.DeletePost = async (req, res, next) => {
  try {
    const query = req.params.query;
    const arr = query.split(",");
    const postid = arr[0];
    const userid = arr[1];
    //  console.log(postid,userid)
    const post = await Post.findById(postid);
    // console.log(post)
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }
    // const user= await User.findById(post.owner);
    // console.log(post.owner)
    // console.log(userid)
    //  console.log(post.owner!= userid)
    if (post.owner != userid) {
      return res.status(400).json({
        success: false,
        message: "Unauthorised",
      });
    }
    await post.remove(); // post deleted from the model

    const user = await User.findById(userid);

    const index = user.local.posts?.indexOf(postid);

    if (index) {
      user.local.posts?.splice(index, 1);
      await user.save();
      return res.status(202).json({
        success: true,
        message: "POST DELETED",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "some error Found",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// likes and dislikes
module.exports.likeAndUnlikePost = async (req, res, next) => {
  try {
    const query = req.params.query;
    const arr = query.split(",");
    const postid = arr[0];
    const userid = arr[1];

    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post Not Found",
      });
    }
    if (post.likes.includes(userid)) {
      const index = post.likes.indexOf(userid);
      post.likes.splice(index, 1);
      await post.save();
      return res.status(200).json({
        success: true,
        post: post.likes,
        message: "POST DISLIKED",
      });
    } else {
      post.likes.push(userid);
      await post.save();
      return res.status(200).json({
        success: true,
        post: post.likes,
        message: "POST LIKED",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// find all post of following

module.exports.FindPostbyfollowing = async (req, res, next) => {
  try {
    // populate pura id ko convert kr dega pura model me
    const { id } = req.params;
    // const user1= await User.findById(id).populate(
    //     "following","posts"
    // )
    //  console.log(user1)  
   
    // console.log(id)
    const user = await User.findById(id);
    // console.log(user)
    // $in operator mongodb me kya krta hai ki koi b array me jo jo match krega usko dusra array me daal dega
    // owner array se match krega user.following array ka
    let post = await Post.find({
      owner: {
        $in: user.local.following,
      },
    });
    const finduserpost = await Post.find({
      owner: {
        $in: id,
      },
    });
    //console.log(post)
    for (let i = 0; i < finduserpost.length; i++) {
      post.push(finduserpost[i]);
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    console.log(err);
  }
};

// commment posts

module.exports.commentsOnPOst = async (req, res, next) => {
  try {
    const { postid, userid, comment } = req.body;
    if (!postid || !userid || !comment) {
      return res.status(400).json({
        success: false,
        message: "Enter comment",
      });
    }
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "post not found",
      });
    }
    const commentindex = post?.comments?.user?.indexOf(userid);
    if (commentindex >= 0) {
      post.comments[commentindex].comment = comment;
      await post.save();
    } 
    else {
      post.comments.push({
        user: userid,
        comment: comment,
      });
      await post.save();
    }

    return res.status(200).json({
      success: true,
      message: "comment added",
    });
  } catch (err) {
    console.log(err);
  }
};

// commment delete

module.exports.deleteComment = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "post not found",
      });
    }
    if (post.owners.to_string() === req.user._id.to_string()) {
      if (req.body.CommentId == undefined) {
        return res.status(400).json({
          success: false,
          message: "enter Comment Id",
        });
      }
      post.comments.forEach((item, index) => {
        if (item._id.to_string() === req.body.CommentId.to_string()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.to_string() === req.user._id.to_string()) {
          return post.comments.splice(index, 1);
        }
      });
      await post.save();
    }
  } catch (err) {
    console.log(err);
  }
};

// update caption
module.exports.Updatecaption = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.id;
    if (user.local.posts.includes(id)) {
      const post = await Post.findById(id);
      post.caption = req.body.caption;
      await post.save();
      return res.status(200).json({
        success: true,
        message: "caption Updated",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "you cant Update",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getAllPost = async (req, res, next) => {
  try {
    const post = await Post.find({});
    // console.log(post);

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    console.log(err);
  }
};
