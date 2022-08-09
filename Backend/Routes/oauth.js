const express=require("express")
const router= express.Router();
const authcontroller = require("../Controllers/auth")
const multer= require("../Config/multer")
//routes
//Base-API--- /api/auth
router.post("/signup",authcontroller.auth_signup_controller)       // signup or register
router.post("/signin",authcontroller.auth_signin_controller)        // signin
router.post("/email/forgot",authcontroller.forgotPassword)      // forgot password
router.post("/email/reset/:token",authcontroller.resetPassword)     // reset password
router.get("/email/confirm/:id",authcontroller.confirm_Email)    // email confirmation 
router.get("/followAndUnfollow/:query",authcontroller.FollowAndUnfollow)    // follow and unfollow
router.post("/update/profile",multer.single("image"),authcontroller.UpdateProfile)     // update profile
router.post("/update/password",authcontroller.UpdatePassword)   // update password
router.delete("/delete/profile/:id",authcontroller.deleteprofile)   // delete profile
router.get("/myprofile/:id",authcontroller.myprofile)      // get my profile
router.get("/anyprofile/:id",authcontroller.getuserprofile)      // get any user profile
router.get("/allprofile",authcontroller.alluserprofile)   // get all user profile
router.get("/mydetail/:id",authcontroller.getmydetail) 
router.get("/oauth/:id",authcontroller.getUser) 
 // get my detail
router.get("/allfriends/:id",authcontroller.getallfriends)

router.post("/feedback", authcontroller.getFeedback);
module.exports=router;