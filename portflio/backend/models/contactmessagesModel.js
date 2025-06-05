const mongoose = require("mongoose");

const contactmessagesSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
    
},{ timestamps: true, versionKey: false });

const contactmessagesModel = mongoose.model("contactmessages", contactmessagesSchema);

module.exports = contactmessagesModel;
