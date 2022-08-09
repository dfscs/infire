const express=require("express")
const router= express.Router();
const multer= require("../Config/multer")
const { image } = require("../Config/Cloudinary");
const postcontroller = require("../Controllers/post")
router.post("/post/upload",multer.single("image"),postcontroller.upload_controller)
router.get("/post/likeandUnlike/:query",postcontroller.likeAndUnlikePost)   // like aur dislike ke lie hai
router.get("/post/delete/:query",postcontroller.DeletePost)  
router.put("/update/caption/:id",postcontroller.Updatecaption) 
router.post("/post/comment",postcontroller.commentsOnPOst)   // update b kr rhe aur add b
router.delete("/post/comment/delete/:id",postcontroller.deleteComment)   // delete b kr rhe
router.get("/post/all",postcontroller.getAllPost); 
router.get("/post/findfollowedpost/:id",postcontroller.FindPostbyfollowing);   // get all user post
module.exports=router