const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_picture: { type: String },
  
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('Users', userSchema);
