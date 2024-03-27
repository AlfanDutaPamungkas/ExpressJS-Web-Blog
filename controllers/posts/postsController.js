const dotenv = require('dotenv');
const domPurifier = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify = domPurifier(new JSDOM().window);
const cloudinary = require("../../config/cloudinary_config");
const notFound = require("../../middlewares/notFound");
const Post = require("../../model/posts/Post");
const User = require("../../model/users/User");
const appErr = require("../../utils/appErr");
dotenv.config();

const createPostsCtrl = async(req, res)=>{
    const { title, description, category } = req.body;
    if (!title || !description || !category || !req.file) {
        return res.render("posts/addPost", {error:"All fields are required", api:process.env.TINY_CLOUD_API_KEY});
    }
    try {
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        const sanitizeDescription = htmlPurify.sanitize(description);
        const postCreated = await Post.create({
            title,
            description:sanitizeDescription,
            category,
            image:req.file.path, 
            user: userFound._id
        });

        userFound.posts.push(postCreated._id);
        await userFound.save();

        res.redirect("/api/v1/users/profile-page");
    } catch (error) {
        return res.render("posts/addPost", {error:error.message, api:""});
    }
};

const getAllPostsCtrl = async(req, res, next)=>{
    try {
        const posts = await Post.find().populate("comments").populate("user");

        res.json({
            status:"succes",
            data:posts
        });
    } catch (error) {
        next(appErr(error.message));
    }
}

const getPostCtrl = async(req, res, next)=>{
    try {
        const postID = req.params.id;
        const post = await Post.findById(postID).populate({
            path:"comments",
            populate:{
                path:"user"
            }
        }).populate("user");
        
        if (!post) {
            // Menampilkan halaman 404 jika post tidak ditemukan
            return notFound(req, res, next);
        }

        res.render("posts/postDetails", {
            post,
            error:""
        });
    } catch (error) {
        next(appErr(error.message));
    }
};

const deletePostCtrl = async(req, res, next)=>{
    try {
        const userID = req.session.userAuth;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(appErr("Post not found", 404));
        }

        if (post.user.toString() !== userID.toString()) {
            return next(appErr("Prohibited", 403));
        }

        const image = post.image;
        const imageID = image.split('/').slice(-2).join('/').split('.')[0];
        // await cloudinary.uploader.destroy(imageID);
        await cloudinary.uploader.destroy(imageID);

        await Post.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(
            userID,
            { $pull: { posts:req.params.id } },
        );

        res.redirect("/");
    } catch (error) {
        next(appErr(error.message));
    }
};

const updatePostCtrl = async(req, res, next)=>{
    const { title, description, category } = req.body;
    try {
        const userID = req.session.userAuth;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.render("posts/updatePost", {
                error:"Post not found",
                post:"",
                api:process.env.TINY_CLOUD_API_KEY
            });
        }

        if (post.user.toString() !== userID.toString()) {
            return res.render("posts/updatePost", {
                error:"You are not allowed to update this post",
                post:"",
                api:process.env.TINY_CLOUD_API_KEY
            });
        }

        const sanitizeDescription = htmlPurify.sanitize(description);
        const postImage = post.image;

        if (req.file) {
            const imageID = postImage.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(imageID);
        }

        await Post.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description:sanitizeDescription,
                category,
                image:req.file ? req.file.path : postImage
            }, {new:true}
        );

        res.redirect(`/api/v1/posts/${req.params.id}`);
    } catch (error) {
        return res.render("posts/updatePost", {
            error:error.message,
            post:""
        });
    }
};

module.exports = {
    createPostsCtrl,
    getAllPostsCtrl,
    getPostCtrl,
    deletePostCtrl,
    updatePostCtrl
}