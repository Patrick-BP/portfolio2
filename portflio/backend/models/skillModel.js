const mongoose = require("mongoose");


const skillsSchema = new mongoose.Schema({
  name: String,
  level: Number,
  icon: {type:String, default: "Code"}     
    
}, {timestamps: true , versionKey: false})

const skillsModel = mongoose.model("skills", skillsSchema);

module.exports = skillsModel;
