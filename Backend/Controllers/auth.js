const User = require("../model/User");
const Post = require("../model/Post");
const Feedback = require("../model/Feedback");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const Cloudinary = require("../Config/Cloudinary");
const async = require("async");
const nodemailer = require("../Config/Email-Template");
const sendEmail = require("../Config/nodemailer");
const router = require("../Routes/post");

// generate id
const { v4: uuidv4 } = require("uuid");
const { resolveSoa } = require("dns");
// make Tokens
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

module.exports.auth_signup_controller = async (req, res, next) => {
  
  // console.log(2)
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        message: "Please fill all the fields",
        ok: false,
      });
    }
    if (password.length<6) {
      return res.json({
        message: "Password not Strong (Should be atleast 6 Character)",
        ok: false,
      });
    }
    const existingUser = await User.findOne({ "local.email": email });
    if (existingUser)
      return res.json({
        message: "User Already Registered, Please Login",
        ok: false,
      });
    const hashed_Pass = await bcrypt.hash(password, 10);
    const user = await new User({
      method: "local",
      local: { name, email, password: hashed_Pass },
    });
    await user.save();

    // console.log(user._id);
    await sendEmail(
      email,
      nodemailer.confirmEmailTemp(user._id, user.local.name)
    );

    return res.status(201).json({
      message: "Email sent, Please check your Mail to confirm",
      ok: true,
    });
  } catch (err) {
    console.log(err);
  }
};

// Email Confirmation
module.exports.confirm_Email = async (req, res, next) => {
  const { id } = req.params;
  //  console.log(55)
  try {
    const user = await User.findByIdAndUpdate(id, {
      $set: {
        "local.confirmed": true,
      },
    });
    if (user.local.confirmed) {
      return res.json({ message: "User already confirmed", ok: false });
    } else {
      const token = createToken(user._id);
      return res.json({
        userId: user._id,
        userName: user.local.name,
        userEmail: user.local.email,

        token: token,
        ok: true,
        message: "Email Confirmed, Account Successfully Created",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.auth_signin_controller = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    if (user === "Incorrect Password!!!" || user === "Incorrect Email!!!") {
      return res.json({ ok: false, message: "Credentials seems to be wrong" });
    }
    if (!user.local.confirmed) {
      return res.status(400).json({
        message: "Email not Confirmed. Please check your email account",
        ok: false,
      });
    } else {
      const token = createToken(user._id);
      const userDetails = {
        userId: user._id,
        userName: user.local.name,
        userEmail: user.local.email,
      };
      return res.status(201).json({
        userDetails,
        token,
        ok: true,
        message: "Logged In Successfully",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

//Forgot password Controller
module.exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString("hex");
        done(err, token);
      });
    },
    function (token, done) {
      // console.log(token);
      User.findOneAndUpdate(
        { "local.email": req.body.email },
        {
          $set: {
            "local.resetPasswordToken": token,
            "local.resetPasswordExpires": Date.now() + 3600000, //1 hour
          },
        },
        (err, user) => {
          if (!user) {
            return res.status(403).json({
              message: "Invalid Credential User Not Found",
              ok: false,
            });
          }
          done(err, token, user);
        }
      );
    },
    async (token, user, done) => {
      try {
        //Sending-Reset-Password-Email
        await sendEmail(
          user.local.email,
          nodemailer.forgotPswdTemp(token, user.local.name)
        );

        return res.status(201).json({
          message: "Email Successfully Sent. Please check your email account",
          ok: true,
        });
      } catch (err) {
        console.log(err);
      }
    },
  ]);
};

//Reset Password
module.exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { pswd, confpswd } = req.body;
    if (!pswd || !confpswd || pswd.length < 6 || confpswd.length < 6) {
      return res.status(400).json({
        message: "Password must be atleast 6 characters long or is Incomplete",
        ok: false,
      });
    }
    if (pswd !== confpswd) {
      return res.status(400).json({ message: "Password Not Matching" });
    }
    const hashPswd = await bcrypt.hash(pswd, 10);

    const user = await User.findOneAndUpdate(
      {
        "local.resetPasswordToken": token,
        "local.resetPasswordExpires": { $gt: Date.now() },
      },
      {
        $set: {
          "local.password": hashPswd,
          "local.confirmed": true,
          "local.resetPasswordToken": undefined,
          "local.resetPasswordExpires": undefined,
        },
      }
    );
    if (!user) {
      return res.status(403).json({
        message: "Password reset token has expired or is invalid",
        ok: false,
      });
    } else {
      //Sending-Success-Email
      await sendEmail(
        user.local.email,
        nodemailer.pswdChangeTemp(user.local.name, user.local.email)
      );

      res.status(200).json({
        message: "Password Successfully Changed",
        ok: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// update profile
module.exports.UpdateProfile = async (req, res, next) => {
  try {
    const { email, name, userId } = req.body;
    const { path } = req.file;
    // console.log(email,name,userId,path)
    const image = await Cloudinary.uploader.upload(path, {
      folder: "post",
      use_filename: true,
    });
    // console.log(image)
    const user = await User.findById(userId);

    if (email) {
      user.local.email = email;
    }
    if (name) {
      user.local.name = name;
    }
    user.local.avatar.public_id = image.public_id;
    user.local.avatar.url = image.url;
    // console.log(user)
    await user.save();

    const userDetails = {
      userId: userId,
      userName: user.local.name,
      userEmail: user.local.email,
    };
    // console.log(userDetails);
    console.log(525);
    return res.status(201).json({
      success: true,
      message: "profile Updated",
      userDetails,
    });
  } catch (err) {
    console.log(err);
  }
};

// update password
module.exports.UpdatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { oldpass, newpass } = req.body;
    const check = await bcrypt.compare(oldpass, user.local.password);
    if (!check) {
      return res.status(400).json({
        success: false,
        message: "password entered wrong",
      });
    }
    const hashed = bcrypt.hash(newpass, 10);
    user.local.password = hashed;
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

//get user_details_by_id
module.exports.getUser = async (req, res, next) => {
  const { id } = req.params;
  //console.log(id)
  try {
    const user = await User.findById(id);
    if (user) {
      const jwttoken = createToken(id);
      const data = {
        userName: user.local.name,
        userEmail: user.local.email,
        userId: id,
      };
      res.status(201).json({
        ok: true,
        token: jwttoken,
        data,
      });
    } else {
      res.json({ message: "User Not found", ok: false });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.getFeedback = async (req, res) => {
  const { name, email, description } = req.body;
  if (!name || !email || !description)
    return res.status(400).json({ message: "Fill all Inputs", ok: false });
  try {
    const feed = await new Feedback({
      name,
      email,
      description,
    });
    await feed.save();
    await sendEmail(
      process.env.MAIL_USER,
      nodemailer.feedbackTemplate(name, email, description)
    );
    return resolveSoa.status(201).json({ message: "Feedback Submitted", ok: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Unable to send Feedback", ok: false });
  }
};

// followers and Unfollowers

module.exports.FollowAndUnfollow = async (req, res, next) => {
  try {
    const query = req.params.query;
    const arr = query.split(",");
    const curruser = arr[0];
    const userfollowed = arr[1];
    const usertofollow = await User.findById(userfollowed);
    const Curruser = await User.findById(curruser);
    if (!usertofollow) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    // console.log(curruser,userfollowed)
    const name = usertofollow.local.name;
    if (usertofollow.local.followers.includes(curruser)) {
      const indexfollowers = usertofollow.local.followers.indexOf(curruser);

      usertofollow.local.followers.splice(indexfollowers, 1);
      const indexfollowing = Curruser.local.following.indexOf(userfollowed);
      Curruser.local.following.splice(indexfollowing, 1);
      var unfriend = false;
      for (let i = 0; i < Curruser.local.friends.length; i++) {
        if (Curruser.local.friends[i].friendid == userfollowed) {
          Curruser.local.friends.splice(i, 1);
          unfriend = true;
          break;
        }
      }
      for (let i = 0; i < usertofollow.local.friends.length; i++) {
        if (usertofollow.local.friends[i].friendid == curruser) {
          usertofollow.local.friends.splice(i, 1);
          unfriend = true;
          break;
        }
      }
      await usertofollow.save();
      await Curruser.save();
      if (unfriend) {
        return res.status(200).json({
          success: true,
          message: `${name} unfollowed and unfriend`,
          user: usertofollow.local,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `${name} unfollowed`,
          user: usertofollow.local,
        });
      }
    }

    usertofollow.local.followers.push(curruser);
    Curruser.local.following.push(userfollowed);
    var isfriend = false;

    // const alreadyfriend= Curruser?.local?.friends?.indexOf({friendid:userfollowed})

    if (Curruser.local.followers.includes(userfollowed)) {
      const conversationId = uuidv4();
      Curruser.local.friends.push({
        conversationId: conversationId,
        friendid: userfollowed,
        friendname: name,
        friendavatar: usertofollow.local?.avatar?.url,
      });
      usertofollow.local.friends.push({
        conversationId: conversationId,
        friendid: curruser,
        friendname: Curruser.local.name,
        friendavatar: Curruser.local?.avatar?.url,
      });
      isfriend = true;
    }

    await usertofollow.save();
    await Curruser.save();

    if (isfriend) {
      return res.status(200).json({
        success: true,
        message: `${name} is Your friend Now`,
        user: Curruser.local,
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `${name} followed`,
        user: usertofollow.local,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// delete profile

module.exports.deleteprofile = async (req, res, next) => {
  try {
    const {id}=req.params()
    const user = await User.findById(id);
    
    const post = user.local.posts;
    const follower = user.local.followers;
    const following = user.local.following; // de;et kroge to followers ko b to hatana hoga aur following ko b
    await user.remove();
    // remove krte hi logout kr dena
    // deleting all post of user
    for (let i = 0; i < post.length; i++) {
      const post = await Post.findById(post[i]);
      if (post) await post.remove();
    }
    for (let i = 0; i < follower.length; i++) {
      const followeduser = await User.findById(follower[i]);
      const index = await followeduser?.following?.indexOf(id);
      followeduser.following.splice(index, 1);
      await followeduser.save();
    }
    for (let i = 0; i < following.length; i++) {
      const followeruser = await User.findById(following[i]);
      const index = await followeruser.follower.indexOf(id);
      followeruser.follower.splice(index, 1);
      await followeruser.save();
    }
    const findpost= await Post.find({
       likes :{
         $in:id
       }
    })
    console.log(findpost)
    return res.status(200).json({
      success:true
    })
  } catch (err) {
    console.log(err);
  }
};

// get my profile
module.exports.myprofile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const post = await Post.find({ owner: id });
    // console.log(post)
    return res.status(200).json({
      success: true,
      post,
    });
  } catch (err) {
    console.log(err);
  }
};

// get user profile

module.exports.getuserprofile = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("posts");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

// get all user

module.exports.alluserprofile = async (req, res, next) => {
  try {
    const user = await User.find({});
    // console.log(user)
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};

// get my detail
module.exports.getmydetail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    // console.log(user.local)
    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.getallfriends = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    // console.log(user)
    return res.status(200).json({
      success: true,
      user: user.local.friends,
    });
  } catch (err) {
    console.log(err);
  }
};
