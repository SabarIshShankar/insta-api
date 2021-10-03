const mongoose = require("mongoose");
const Post = require('../models/Post');
const User = require("../modles/User");
const Comment = require("../models/Comment");
const asyncHandler = require("../middlewares/asyncHandler");

exports.getPosts = asyncHandler(async(req, res, next) => {
    const posts = await Post.find();
    res.status(200).json({
        success: true,
        data: posts
    });
});

exports.getPost = asyncHandler(async(req, res, next) => {
    const post = await Post.findById(req.params.id)
        .populate({
            path: "comments",
            select: "text",
            populate: {
                path:"user",
                select: "username avatar"
            },
        })
        .populate({
            path: "user",
            select: "username avatar",
        })
        .lean()
        .exec();

    if(!post){
        return next({
            message: `No post found for id${req.params.id}`,
            statusCode: 404,
        })
    }

    post.isMine = req.user.id === post.user._id.toString();

    const likes = post.likes.map((like) => like.toString());
    post.isLiked = likes.includes(req.user.id);

    const savedPosts = req.user.savedPosts.map((post) => post.toString());
    post.isSaved = savedPosts.includes(req.params.id);

    post.comments.forEach((comment) => {
        comment.isCommentMine = false;

        const userStr = comment.user._id.toString();
        if(userStr === req.user.id){
            comment.isCommentMine = true;
        }
    })
    res.status(200).json({
        success: true,
        data: post
    });
});