const express = require('express');
const multer = require('multer');
const { registerCtrl, loginCtrl, userDetailCtrl, profileCtrl, uploadPhotoProfileCtrl, uploadCoverCtrl, updatePasswordCtrl, updateUserCtrl, logoutCtrl, renderLoginForm } = require('../../controllers/users/usersController');
const protected = require("../../middlewares/protected");
const storage = require('../../config/cloudinary');
const userRoutes = express.Router();

const upload = multer({
    storage,
    limits : 1024 * 1024 * 3
});

userRoutes.get("/register", (req, res) => {
    res.render("users/register", {
        error:""
    });
});

userRoutes.post("/register", registerCtrl);

userRoutes.get("/login", renderLoginForm);

userRoutes.post("/login", loginCtrl);

userRoutes.get("/profile-page", protected, profileCtrl);

userRoutes.get("/profile-photo-upload", protected, (req, res) => {
    res.render("users/uploadProfilePhoto", {
        error:""
    });
});

userRoutes.put(
    "/profile-photo-upload",
    protected, 
    upload.single('profile'), 
    uploadPhotoProfileCtrl
);

userRoutes.get("/cover-photo-upload", protected, (req, res) => {
    res.render("users/uploadCoverPhoto" , {
        error:""
    });
});

userRoutes.put(
    "/cover-photo-upload", 
    protected,
    upload.single("cover"),
    uploadCoverCtrl
);

userRoutes.put("/update-password", protected, updatePasswordCtrl);

userRoutes.get("/update-password", protected, (req, res)=>{
    res.render("users/updatePassword", {
        error:""
    });
})

userRoutes.put("/update", protected, updateUserCtrl);

userRoutes.get("/logout", logoutCtrl);

userRoutes.get("/:id", protected, userDetailCtrl);

module.exports = userRoutes;