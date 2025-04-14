const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const expense = new Expense({ ...req.body, user: req.user.id });
  if (req.file) {
    expense.receipt_url = `/uploads/receipts/${req.file.filename}`;
  }
  await expense.save();
  res.json(expense);
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id });
  res.json(expenses);
};

exports.updateExpense = async (req, res) => {
  const updateData = { ...req.body };
  if (req.file) updateData.receipt_url = `/uploads/receipts/${req.file.filename}`;

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
