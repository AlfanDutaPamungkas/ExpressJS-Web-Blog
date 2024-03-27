const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
    if (req.session.userAuth) {
        return next();
    } else {
        res.render("users/notAuthorize")
    }
};

module.exports = protected;