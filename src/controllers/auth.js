const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

exports.login = asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;
    if(!email||!password){
        return next({
            message: "Please provider email and password",
            statusCode: 400,
        });
    }

    const user = await User.findOne({email});
    if(!user){
        return next({
            message: "The email is not yet registeredto an account",
            statusCode: 400,
        });
    }

    const match = await user.checkPassword(password);

    if(!match){
        return next({
            message: 'The password doesnt match', statusCode: 400
        });
    }

    const token = user.getJwtToken();

    res.status(200).json({success: true, token});
});

exports.signup = asyncHandler(async(req, res, next) => {
    const {fullname, username, email, password} = req.body;
    const user = await User.create({fullname, username, email, password});
    const token = user.getJwtToken();
    res.status(200).json({success: true, token});
});

exports.me = asyncHandler(async(req, res, next) => {
    const {avatar, username, fullname, email, _id, website, bio} = req.user;

    res
        .status(200)
        .json({
            success: true,
            data: {
                avatar, username, fullname, email, _id, website, bio
            },
        });
});