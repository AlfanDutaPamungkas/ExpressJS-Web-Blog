const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require("method-override");
const dbConnect = require('./config/dbConnect');
const userRoutes = require('./routes/users/users');
const postRoutes = require('./routes/posts/posts');
const commentRoutes = require('./routes/comments/comments');
const globalErrHandler = require('./middlewares/globalErrHandler');
const Post = require('./model/posts/Post');
const { truncatePost } = require('./utils/helpers');
const notFound = require('./middlewares/notFound');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

dbConnect();

app.locals.truncatePost = truncatePost;

app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))

app.use(session({
    secret:process.env.SESSION_KEY,
    resave:false,
    saveUninitialized:true,
    store:new MongoStore({
        mongoUrl:process.env.DB_URL,
        ttl:24*60*60
    })
}));

app.use((req, res, next)=>{
    if (req.session.userAuth) {
        res.locals.userAuth = req.session.userAuth;
    }else{
        res.locals.userAuth = null;
    }
    next();
});

app.get("/", async(req, res) => {
    try {
        const posts = await Post.find().populate("user");
        res.render("index", {posts});
    } catch (error) {
        res.render("index", {error:error.message});
    }
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/comments", commentRoutes);

app.use(notFound);

app.use(globalErrHandler);

app.listen(PORT, console.log(`The server running on ${PORT}`));