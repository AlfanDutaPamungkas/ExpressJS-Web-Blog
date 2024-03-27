const bcrypt = require('bcryptjs');
const User = require("../../model/users/User");
const appErr = require('../../utils/appErr');

let message = null;

const registerCtrl = async(req, res, next)=>{
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.render("users/register", {
            error:"All fields are required"
        });
    }

    try {
        const userFound = await User.findOne({ email });

        if (userFound) {
            return res.render("users/register", {
                error:"Email already exist"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname,
            email,
            password:passwordHashed
        });

        res.redirect("/api/v1/users/login");
    } catch (error) {
        next(appErr(error.message));
    }
};

const renderLoginForm = (req, res) => {
    if (message) {
        return res.render("users/login" , {
            error:message
        });
    }
    res.render("users/login" , {
        error:""
    });
};

const loginCtrl = async(req, res, next)=>{
    const { email, password } = req.body;
    if ( !email || !password) {
        return res.render("users/login", {
            error:"Email and Password fields are required"
        });
    }
    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return res.render("users/login", {
                error:"Invalid login credentials"
            });
        }
        
        const isValid = await bcrypt.compare(password, userFound.password);
        
        if (!isValid) {
            return res.render("users/login", {
                error:"Invalid login credentials"
            });
        }

        req.session.userAuth = userFound._id;

        res.redirect("/api/v1/users/profile-page")

    } catch (error) {
        next(appErr(error.message));
    }
};

const userDetailCtrl = async(req, res, next)=>{
    try {
        const userID = req.params.id;
        const user = await User.findById(userID);

        if (!user) {
            return res.render("users/updateUser", {
                user:"",
                error: "User not found",
            });
        }

        res.render("users/updateUser", {
            user,
            error:""
        });
    } catch (error) {
        return res.render("users/updateUser", {
            user:"",
            error: error.message,
        });
    }
};

const profileCtrl =  async(req, res, next)=>{
    try {
        const userID = req.session.userAuth;
        const user = await User.findById(userID).populate('posts').populate('comments');
        res.render("users/profile", { user });
    } catch (error) {
        next(appErr(error.message));
    }
};

const uploadPhotoProfileCtrl = async(req, res)=>{
    try {
        if (!req.file) {
            return res.render("users/uploadProfilePhoto", {
              error: "Please upload image",
            });
        }

        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        if (!userFound) {
            return res.render("users/uploadProfilePhoto", {
                error: "User not found",
            });
        }

        await User.findByIdAndUpdate(userID, 
            { profileImage: req.file.path },
            { new : true }
        );

        res.redirect("/api/v1/users/profile-page");
    } catch (error) {
        return res.render("users/uploadProfilePhoto", {
            error: error.message,
        });
    }
};

const uploadCoverCtrl = async(req, res)=>{
    try {
        if (!req.file) {
            return res.render("users/uploadProfilePhoto", {
              error: "Please upload image",
            });
        }

        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        if (!userFound) {
            return res.render("users/uploadProfilePhoto", {
                error: "User not found",
            });
        }

        await User.findByIdAndUpdate(userID, 
            { coverImage: req.file.path },
            { new : true }
        );

        res.redirect("/api/v1/users/profile-page");
    } catch (error) {
        return res.render("users/uploadCoverPhoto", {
            error: error.message,
        });
    }
};

const updatePasswordCtrl =  async(req, res, next)=>{
    const {password} = req.body;
    try {
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        if (!userFound) {
            return res.render("users/updatePassword", {
                error:"User not found"
            });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);

            await User.findByIdAndUpdate(
                userID,
                { password: passwordHashed },
                { new: true }
            );
            
            req.session.destroy();
            
            message = "Password has been changed succesfully, please login again";

            res.redirect("/api/v1/users/login");
        } else {
            return res.render("users/updatePassword", {
                error:"Please fill the field"
            });
        }
    } catch (error) {
        return res.render("users/updatePassword", {
            error:error.message
        });
    }
};

const updateUserCtrl = async(req, res, next)=>{
    const { fullname, email, role, bio } = req.body;
    if (!fullname || !email || !role || !bio) {
        return res.render("users/updateUser", {
            error: "Please provide details",
            user:""
        });
    }
    try {
        const userID = req.session.userAuth;
        const userFound = await User.findById(userID);
        if (!userFound) {
            return res.render("users/updateUser", {
                error: "User not found",
                user:""
            });
        }

        if (email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.render("users/updateUser", {
                    error: "Email is taken",
                    user:""
                });
            }
        }

        const user = await User.findByIdAndUpdate(userID, {
            fullname,
            email,
            role,
            bio
        }, {new:true});

        req.session.destroy();
        
        message = "You have succesfully updated your account details, please login again"

        res.redirect("/api/v1/users/login");
    } catch (error) {
        return res.render("users/updateUser", {
            error: error.message,
            user:""
        });
    }
};

const logoutCtrl = (req, res)=>{
    message=null;
    req.session.destroy(()=>{
        res.redirect("/api/v1/users/login");
    });
};

module.exports = {
    registerCtrl,
    loginCtrl,
    userDetailCtrl,
    profileCtrl,
    uploadPhotoProfileCtrl,
    uploadCoverCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl,
    renderLoginForm
};