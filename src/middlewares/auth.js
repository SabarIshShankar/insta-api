const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async(req, res, next) => {
    let token;
    if(
        req.header.authorization && req.headers.authorization.startsWith("Bearer")
    ){
        token = req.header.authorization.split(" ")[1];
    }

    if(!token){
        return next({
            message: "You need to be logged in to visit the route",
            statusCode: 403
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if(!user){
            return next({message: `No user found for id ${decoded.id}`});
        }
        req.user = user;
        next();
    } catch(err){
        next({
            message: 'Log in to visit this route',
            statusCode: 403,
        });
    }
};