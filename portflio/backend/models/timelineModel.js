const mongoose = require("mongoose");

const timelineentriesSchema = new mongoose.Schema({
    title: String,
    company: String,
    description: String,
    dateRange: String,
    skills: [String],
    order: Number,
    
}, {timestamps: true}, {versionKey: false})

const timelineentriesModel = mongoose.model("timelineentries", timelineentriesSchema);

module.exports = timelineentriesModel;
