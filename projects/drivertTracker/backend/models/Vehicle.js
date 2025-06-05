const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    model: String,
    make: String,
    year: Number,
    license: String,
    mileageRate: { type: Number, default: 0.57 }
  }, { timestamps: true , versionKey: false });
  
  module.exports = mongoose.model('Vehicle', vehicleSchema);