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
});

exports.follow = asyncHandler(async(req, res, next) => {
    const user = await User.findyById(req.params.id);

    if(!user) {
        return next({
            message: `No user found for ${req.params.id}`,
            statusCode: 404,
        });
    }
    if(req.params.id === req.params.id){
        return next({message: "cant follow yourself", status: 400});
    }

    if(user.followers.includes(req.user.id)){
        return next({
            message: "You are already following", status: 400
        })
    }

    await User.findByIdAndUpdate(req.params.id, {
        $push: {followers: req.user.id},
        $inc: {followersCount: 1}
    });
    await User.findByIdAndUpdate(req.user.id, {
        $push: {following: req.params.id},
        $inc: {followingCount: 1},
    });

    res.status(200).json({success: true, data: {}})
});

exports.unfollow = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next({
            message: `No user found ID ${req.params.id}`,
            statusCode: 404,
        });
    }

    if(req.params.id === req.user.id){
        return next({message: "You cant follow yourself", status: 400});
    }

    await User.findByIdAndUpdate(req.params.id, {
        $pull: {followers: req.user.id},
        $inc: {followersCount: -1},
    });

    await User.findByIdAndUpdate(req.user.id, {
        $pull: {following: req.params.id},
        $inc: {followingCount: -1},
    });

    res.status(200).json({success: true, data: {}});
});

