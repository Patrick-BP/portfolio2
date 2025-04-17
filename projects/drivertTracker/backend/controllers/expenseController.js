const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  try{
    // if (!req.file) {
    //   return res.status(400).json({ msg: 'Please upload a receipt' });
    // }
    const expenseData = { ...req.body, user: req.user.id };
    console.log(req.body)
    if (req.file) {
      expenseData.receipt_url = `/uploads/receipts/${req.file.filename}`;
    }
    
    const expense = await Expense.create(expenseData);
    res.json(expense);

  }catch (error) {
    res.status(500).json({ msg: 'Server Error', error: error.message });
  }  
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
