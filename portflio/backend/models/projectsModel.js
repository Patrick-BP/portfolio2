const mongoose = require("mongoose");


const projectsSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: {type: String},
  liveUrl: String,
  githubUrl: String,
  category: String,
  techStack: [String],
  featured: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}     
    
}, {timestamps: true , versionKey: false})

const projectsModel = mongoose.model("projects", projectsSchema);

module.exports = projectsModel;
