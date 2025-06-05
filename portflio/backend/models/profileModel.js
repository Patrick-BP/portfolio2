const mongoose = require("mongoose");

const profilesSchema = new mongoose.Schema({
    name: String,
    title: String,
    bio: String,
    avatar: String,
    email: String,
    location: String,
    resumeUrl: String,
    heading: String,
    phone: String,
    twitter: String,
    linkedin: String,
    github: String,
   
    
}, {timestamps: true, versionKey: false})

const profilesModel = mongoose.model("profiles", profilesSchema);

module.exports = profilesModel;
