const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            default:"https://th.bing.com/th/id/OIP.R9HMSxN_IRyxw9-iE1usugAAAA?rs=1&pid=ImgDetMain"
        },
        coverImage: {
            type: String,
            default:"https://teknologi.viborg.dk/media/25plpxgq/gruppe-social.jpg?anchor=center&mode=crop&width=864&rnd=132514669530830000&heightratio=0.6086956521739131"
        },
        role:{
            type: String,
            default:"Blogger"
        },
        bio:{
            type: String,
            default:"I'am a blogger"
        },
        posts: [
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post" 
            }
        ],
        comments: [
            { 
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment" 
            }
        ],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;