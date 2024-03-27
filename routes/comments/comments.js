const express = require('express');
const { createCommentCtrl, getCommentCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../../controllers/comments/commentsController');
const protected = require('../../middlewares/protected');
const commentRoutes = express.Router();

commentRoutes.post("/:id", protected, createCommentCtrl);

commentRoutes.get("/:id", getCommentCtrl);

commentRoutes.delete("/:id", protected, deleteCommentCtrl);

commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;