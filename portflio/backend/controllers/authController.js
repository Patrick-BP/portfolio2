const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// Get User Profile (Protected)
const getUserProfile = async (req, res) => {
    res.json(req.user);
};

module.exports = { registerUser, loginUser, getUserProfile };
