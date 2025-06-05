const fs = require('fs');
const csv = require('csv-parser');
const { Parser } = require('json2csv');
const Expense = require('../models/Expense');

// Import CSV into database
const importCSV = async (filePath) => {
  const expenses = [];
  
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      expenses.push(row);
    })
    .on('end', async () => {
      for (const exp of expenses) {
        const expense = new Expense({
          category: exp.category,
          date: new Date(exp.date),
          description: exp.description,
          amount: parseFloat(exp.amount),
          receipt_url: exp.receipt_url,
          previous_mileage: parseFloat(exp.previous_mileage),
          current_mileage: parseFloat(exp.current_mileage),
          gallons: parseFloat(exp.gallons),
          miles: parseFloat(exp.current_mileage) - parseFloat(exp.previous_mileage),
          fuel_efficiency: (parseFloat(exp.current_mileage) - parseFloat(exp.previous_mileage)) / parseFloat(exp.gallons),
          business_miles: exp.category === 'business' ? parseFloat(exp.current_mileage) - parseFloat(exp.previous_mileage) : 0
        });
        await expense.save();
      }
      console.log('CSV data imported successfully!');
    });
};

// Export data to CSV
const exportCSV = async () => {
  const expenses = await Expense.find();
  const json2csvParser = new Parser();
  const csvData = json2csvParser.parse(expenses);
  const filePath = `./exports/expenses-report-${Date.now()}.csv`;

  fs.writeFileSync(filePath, csvData);
  console.log(`CSV report generated: ${filePath}`);
  return filePath;
};

module.exports = { importCSV, exportCSV };
