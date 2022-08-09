const mongoose = require("mongoose")
const bcrypt=require("bcrypt");
const {isEmail } = require("validator");

const userSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ["local", "google"],
    required: true,
  },
  local: {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
    },
    avatar: {
      public_id: String,
      url: String,
    },
    email: {
      type: String,
      validate: [isEmail, "Please enter a valid email"],
      unique: [true, "Email Already Exists"],
    },
    password: {
      type: String,
      required: [true, "Please Enter Password"],
      minlength: [6, "Password must be at least 6 Character"],
      select: true, // select mtlb agar hm copy krega data user ka password ko chor kr copy hoga
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // user ke andar array hai post ka usme user jitna post kia hai wo save hai
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friends:[
      {
        conversationId: String,
         friendid: String,
         friendname: String,
          friendavatar: String,
      }
    ],
    secretToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  google: {
    id: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
  },
});


// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ "local.email": email });
  
  if (user) {
  
    const auth = await bcrypt.compare(password, user.local.password);
    if (auth) return user;
    return "Incorrect Password!!!";
  }
  return "Incorrect Email!!!";
};






const User = mongoose.model("userSchema", userSchema);



module.exports = User;
