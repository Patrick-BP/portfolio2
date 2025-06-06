
const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    category: String,
    date: Date,
    description: String,
    amount: Number,
    receipt: String,
    previous_mileage: Number,
    current_mileage: Number,
    gallons: Number,
    miles: Number,
    fuel_efficiency: Number,
    business_miles: Number,
  }, { timestamps: true , versionKey: false });
  
  module.exports = mongoose.model('Expense', expenseSchema);