const mongoose = require("mongoose");

const blogpostsSchema = new mongoose.Schema({
    title: String,
    content: String,
    thumbnail: {type:String},
    excerpt: String,
    readTime: {type:Number, default: 0},
    tags:[String],
    publishedAt:{type:Date},
    published:{type:Boolean, default:false},
    publishedBy: String
}, {timestamps: true , versionKey: false});



const blogpostsModel = mongoose.model("blogposts", blogpostsSchema);

module.exports = blogpostsModel;
