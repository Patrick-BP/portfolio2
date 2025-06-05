const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Response = require("../models/responseobj");


const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer")) {
        try {
            const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json(new Response(true,"Unauthorized, invalid token" , null));
        }
    } else {
        res.status(401).json(new Response(true, "No token, authorization denied" , null));
    }
};

module.exports = { protect };
