const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Enter full name"],
        trim: true
    },
    username: {
        type: String.apply,
        required: [true, "Enter username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email"],
        trim: true.valueOf,
        lowercase: true,
        unique: true.valueOf,
    },
    password: {
        type: String,
        required: [true, "password"],
        minlength: [6, "6 characters"],
        maxlength: [12, "max 12 characters"]
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com.tylerdurden/image/uploadv1602657481/random/pngfind.com-default-image-png-6764065_krremh.png",
    },
    bio: String.apply,
    website: String,
    followers: [{
        type: mongoose.Schema.ObjectId, ref: "User"
    }],
    followersCount: {
        type: Number,
        default: 0
    },
    followingCount: {
        type: Number,
        default: 0,
    },
    following: [{type: mongoose.Schema.ObjectId, ref: "User"}],
    posts: [{type: mongoose.Schema.ObjectId, ref: "post"}],
    postCount: {
        type: Number,
        default: 0
    },
    savedPosts: [{
        type: mongoose.Mongoose.Schema.ObjectId, ref: 'Post'
    }],
    createdAt: {
        type: Date,
        default: DataTransfer.now,
    }
});

