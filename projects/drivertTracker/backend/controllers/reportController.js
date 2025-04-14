const Expense = require('../models/Expense');
const generatePDF = require('../utils/pdfGenerator');
const { importCSV, exportCSV } = require('../utils/csvHandler');

// Generate report (PDF) based on range
exports.generateReport = async (req, res, range) => {
  const userId = req.user._id;
  const { from, to } = req.body; // Dates are passed for range filtering

  // Date filter
  let dateFilter = {};
  if (from && to) {
    dateFilter = { date: { $gte: new Date(from), $lte: new Date(to) } };
  }

  // Fetch Expenses based on the date range
  const expenses = await Expense.find({ user: userId, ...dateFilter });

  // Calculate fuel efficiency and category breakdown
  const fuelEfficiencyData = await this.getFuelEfficiency(req, res);
  const categoryBreakdown = await this.getCategoryBreakdown(req, res);

  // Generate PDF report
  const pdfPath = generatePDF(expenses, fuelEfficiencyData.fuelEfficiency, categoryBreakdown, range);
  
  res.json({ msg: 'PDF generated', filePath: pdfPath });
};

// Category breakdown
exports.getCategoryBreakdown = async (req, res) => {
  const userId = req.user._id;
  const result = await Expense.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(result);
};

// Fuel efficiency
exports.getFuelEfficiency = async (req, res) => {
  const userId = req.user._id;
  const expenses = await Expense.find({ user: userId });
  const fuelData = expenses.reduce((acc, exp) => {
    if (exp.gallons && exp.previous_mileage != null && exp.current_mileage != null) {
      const miles = exp.current_mileage - exp.previous_mileage;
      acc.totalMiles += miles;
      acc.totalGallons += exp.gallons;
    }
    return acc;
  }, { totalMiles: 0, totalGallons: 0 });

  const efficiency = fuelData.totalMiles && fuelData.totalGallons ? (fuelData.totalMiles / fuelData.totalGallons) : 0;
  res.json({ totalMiles: fuelData.totalMiles, totalGallons: fuelData.totalGallons, fuelEfficiency: efficiency });
};

// Import CSV data
exports.importCSV = async (req, res) => {
  const filePath = req.file.path;
  await importCSV(filePath);
  res.json({ msg: 'CSV Data Imported' });
};

// Export data to CSV
exports.exportCSV = async (req, res) => {
  const filePath = await exportCSV();
  res.download(filePath); // Send the CSV file to the client
};
