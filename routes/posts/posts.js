const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const { createPostsCtrl, getAllPostsCtrl, getPostCtrl, deletePostCtrl, updatePostCtrl } = require('../../controllers/posts/postsController');
const protected = require("../../middlewares/protected");
const storage = require('../../config/cloudinary');
const Post = require('../../model/posts/Post');
const postRoutes = express.Router();
dotenv.config();

const upload = multer({
    storage,
    limits : 1024 * 1024 * 3
});

postRoutes.get("/create-post", protected, (req, res)=>{
    res.render("posts/addPost", {error:"", api:process.env.TINY_CLOUD_API_KEY});
});

postRoutes.post(
    "/", 
    protected,
    upload.single("file"),
    createPostsCtrl   
);

postRoutes.get("/", getAllPostsCtrl);

postRoutes.get("/get-form-update/:id", protected, async(req,res) =>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.render("posts/updatePost",{
                post:"",
                error:"Post Not Found",
                api:process.env.TINY_CLOUD_API_KEY
            });
        }
        res.render("posts/updatePost", {
            post,
            error:"",
            api:process.env.TINY_CLOUD_API_KEY
        });
    } catch (error) {
        res.render("posts/updatePost", {
            post:"",
            error:error.message
        });
    }
});

postRoutes.get("/:id", getPostCtrl);

postRoutes.delete("/:id", protected, deletePostCtrl);

postRoutes.put(
    "/:id", 
    protected, 
    upload.single("file"), 
    updatePostCtrl
);

module.exports = postRoutes