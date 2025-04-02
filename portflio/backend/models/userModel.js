const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    role: String
    
}, {timestamps: true, versionKey: false})

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;
