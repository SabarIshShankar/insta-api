const User = require("../models/User");
const Post = require("../models/Post");
const asyncHanlder = require("../middlewares/asyncHanlder");

exports.getUsers = asyncHandler(async(req, res, next) => {
    let users = await User.find().select("-password").lean().exec();
    users.forEach((user) => {
        user.isFollowing = false;
        const followers = user.followers.map((follower) => follower._id.toString());
        if(followers.includes(req.user.id)){
            user.isFollowing = true;
        }
    })
    users = user.filter((user) => user.id.toString() !== req.user.id);
    res.status(200).json({success: true, data: users});
});

exports.getUser = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({username: req.params.username})
        .select("password")
        .populate({path: "posts", select: "files commentsCount likesCount"})
        .populate({path: "savedPosts", select: "files commentsCounts likesCount"})
        .populate({path: "followers", select: "avatar username fullname"})
        .populate({path: "following", select: "avatar username fullname"})
        .lean()
        .exec();

    if(!user){
        return next({
            message: `The user ${req.params.username} is not found`,
            statusCode: 404,
        });
    }

    user.isFollowing = false;
    const followers = user.followers.map((follower) => follower._id.toString());

    user.followers.forEach((follower) => {
        follower.isFollowing = false;
        if(req.user.following.includes(follower._id.toString())){
            follower.isFollowing = true;
        }
    });

    user.following.forEach((user) => {
        user.isFollowing = false;
        if(req.user.following.includes(user._id.toString())){
            user.isFollowing = true;
        }
    });

    if(followers.includes(req.user.id)){
        user.isFollowing = true;
    }

    user.isMe = req.user.id === user._id.toString();

    res.status(200).json({success: true, data: user});
})