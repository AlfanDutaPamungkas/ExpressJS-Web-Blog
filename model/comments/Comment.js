const mongoose = require('mongoose');

const  commentShema = new mongoose.Schema(
    {
        user : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        post : {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Post",
        },
        message: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", commentShema);

module.exports = Comment;