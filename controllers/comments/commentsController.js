const Comment = require("../../model/comments/Comment");
const Post = require("../../model/posts/Post");
const User = require("../../model/users/User");
const appErr = require("../../utils/appErr");

const createCommentCtrl = async(req, res, next)=>{
    const {message} = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return next(appErr("Post not found", 404));
        }

        const comment = await Comment.create({
            user:req.session.userAuth,
            post:req.params.id,
            message
        });

        post.comments.push(comment._id);
        await post.save({ validateBeforeSave:false });

        const user = await User.findById(req.session.userAuth);
        user.comments.push(comment._id);
        await user.save({ validateBeforeSave:false });

        res.redirect(`/api/v1/posts/${req.params.id}`);
    } catch (error) {
        next(appErr(error.message));
    }
};

const getCommentCtrl = async(req, res, next)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.render("comments/updateComment", {
                comment:"",
                error:"comment not found"
            });
        }

        res.render("comments/updateComment", {
            comment,
            error:""
        });
    } catch (error) {
        res.render("comments/updateComment", {
            comment:"",
            error:error.message
        });
    }
};

const deleteCommentCtrl =  async(req, res, next)=>{
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(appErr("Post not found", 403));
        }

        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this comment", 405));
        }
        
        await Comment.findByIdAndDelete(req.params.id);

        await User.findByIdAndUpdate(
            req.session.userAuth,
            { $pull: { comments:req.params.id } },
        );

        await Post.findByIdAndUpdate(
            comment.post,
            { $pull: { comments:req.params.id } },
        );

        res.redirect(`/api/v1/posts/${comment.post._id}`);
    } catch (error) {
        next(appErr(error.message));
    }
};

const updateCommentCtrl = async(req, res, next)=>{
    const { message } = req.body;
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return next(appErr("Post not found", 403));
        }

        if (comment.user.toString() !== req.session.userAuth.toString()) {
            return next(appErr("You are not allowed to update this comment", 405));
        }

        const commenttUpdated = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                message
            }, {new:true}
        );

        res.redirect(`/api/v1/posts/${comment.post._id}`);
    } catch (error) {
        next(appErr(error.message));
    }
};

module.exports = {
    createCommentCtrl,
    getCommentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}