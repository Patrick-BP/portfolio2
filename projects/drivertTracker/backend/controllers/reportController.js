// ✅ Full reportController.js with accurate calculations and all reports

const Expense = require('../models/Expense');
const { generatePDF } = require('../utils/pdfGenerator');
const mongoose = require('mongoose');

// 🔁 Reusable function to calculate grouped totals
async function getSummaryByPeriod(userId, period = 'month') {
  const expenses = await Expense.find({ user: userId });

  return Object.values(
    expenses.reduce((acc, e) => {
      let key;
      const date = new Date(e.date);

      if (period === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (period === 'quarter') {
        const quarter = Math.ceil((date.getMonth() + 1) / 3);
        key = `${date.getFullYear()}-Q${quarter}`;
      } else if (period === 'year') {
        key = `${date.getFullYear()}`;
      }

      if (!acc[key]) {
        acc[key] = {
          _id: key,
          totalMileage: 0,
          totalFuel: 0,
          totalExpenses: 0,
          entryCount: 0
        };
      }

      acc[key].totalMileage += (e.current_mileage || 0) - (e.previous_mileage || 0);
      acc[key].totalFuel += e.gallons || 0;
      acc[key].totalExpenses += e.amount || 0;
      acc[key].entryCount++;

      return acc;
    }, {})
  ).sort((a, b) => a._id.localeCompare(b._id));
}

// 📊 Category Breakdown
async function getCategoryBreakdown(userId) {
  return await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } },
    { $limit: 5 }
  ]);
}

// 🚗 Fuel Efficiency Calculation
async function getFuelEfficiency(userId) {
  return await Expense.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        gallons: { $gt: 0 },
        current_mileage: { $exists: true },
        previous_mileage: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        avgEfficiency: {
          $avg: {
            $divide: [
              { $subtract: ["$current_mileage", "$previous_mileage"] },
              "$gallons"
            ]
          }
        },
        entries: { $sum: 1 }
      }
    }
  ]);
}

// 🔍 Entry-Level Mileage Differences
async function getMileageDetails(userId) {
  const expenses = await Expense.find({ user: userId }, 'date previous_mileage current_mileage')
    .sort({ date: 1 });

  return expenses.map(exp => ({
    date: exp.date,
    mileageDelta: (exp.current_mileage || 0) - (exp.previous_mileage || 0)
  }));
}

// 🧾 Generate PDF with full dataset
exports.generateReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
    const monthly = await getSummaryByPeriod(userId, 'month');
    const quarterly = await getSummaryByPeriod(userId, 'quarter');
    const yearly = await getSummaryByPeriod(userId, 'year');
    const categories = await getCategoryBreakdown(userId);
    const fuelStats = await getFuelEfficiency(userId);
    const mileageDetails = await getMileageDetails(userId);

    const summary = {
      totalExpenses: expenses.reduce((acc, e) => acc + (e.amount || 0), 0),
      totalMiles: expenses.reduce((acc, e) => acc + ((e.current_mileage || 0) - (e.previous_mileage || 0)), 0),
      totalFuel: expenses.reduce((acc, e) => acc + (e.gallons || 0), 0),
    };

    const pdfBuffer = await generatePDF({ expenses, summary, monthly, quarterly, yearly, categories, fuelStats, mileageDetails });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="report.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Report generation failed.' });
  }
};

// 📁 JSON summary endpoints
exports.getMonthlySummary = async (req, res) => {
  try {
    const data = await getSummaryByPeriod(req.user.id, 'month');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load monthly summary.' });
  }
};

exports.getQuarterlySummary = async (req, res) => {
  try {
    const data = await getSummaryByPeriod(req.user.id, 'quarter');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load quarterly summary.' });
  }
};

exports.getYearlySummary = async (req, res) => {
  try {
    const data = await getSummaryByPeriod(req.user.id, 'year');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load yearly summary.' });
  }
};

exports.getTopCategories = async (req, res) => {
  try {
    const data = await getCategoryBreakdown(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load category data.' });
  }
};

exports.getFuelEfficiencyStats = async (req, res) => {
  try {
    const data = await getFuelEfficiency(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load fuel efficiency data.' });
  }
};

exports.getMileageDetails = async (req, res) => {
  try {
    const data = await getMileageDetails(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load mileage details.' });
  }
};
