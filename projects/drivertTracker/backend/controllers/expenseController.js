const Expense = require('../models/Expense');
const Vehicle = require('../models/Vehicle');

exports.addExpense = async (req, res) => {
  try {
    const {
      category,
      date,
      description,
      amount,
      current_mileage,
      previous_mileage,
      gallons
    } = req.body;

    const expenseData = {
      user: req.user.id,
      category,
      date,
      description,
      amount,
    };

    if (current_mileage) expenseData.current_mileage = current_mileage;
    if (previous_mileage) expenseData.previous_mileage = previous_mileage;
    if (gallons) expenseData.gallons = gallons;

    // Only use uploaded file, not raw req.body.receipt
    if (req.file) {
      expenseData.receipt = `/uploads/receipts/${req.file.filename}`;
    }

    const expense = await Expense.create(expenseData);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }
};




exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });
  res.json(expenses);
};

exports.updateExpense = async (req, res) => {
  const updateData = { ...req.body };

  if (req.file) updateData.receipt = `/uploads/receipts/${req.file.filename}`;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    updateData,
    { new: true }
  );
  res.json(expense);
};

exports.deleteExpense = async (req, res) => {
  await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ msg: 'Deleted' });
};
exports.getVehiclepreviousMileage = async (req, res) => {
  const vehicle = await Vehicle.findOne({ user: req.user.id });
  if (!vehicle) {
    return res.status(404).json({ msg: 'Vehicle not found' });
  }
  const previousMileage = (await Expense.findOne({ user: req.user.id }).sort({ date: -1 })).current_mileage;
  res.json(previousMileage);
};
