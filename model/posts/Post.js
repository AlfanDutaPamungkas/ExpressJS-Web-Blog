const mongoose = require('mongoose');

const postShema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            enum: ["technology", "health", "travel", "fashion", "culinary", "entertainmen", "other"],
        },
        image : {
            type: String,
            required: true,
        },
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postShema);

module.exports = Post;