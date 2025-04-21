const PDFDocument = require('pdfkit');

// Helper to convert stream to buffer
function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

const generatePDF = async ({ expenses, summary, monthly, quarterly, yearly, categories, fuelStats, mileageDetails }) => {
  const doc = new PDFDocument();

  // Header
  doc.fontSize(20).text('Rideshare Expenses Report', { align: 'center' });
  doc.moveDown(1);

  // Totals Summary
  doc.fontSize(14).text(`Total Expenses: $${summary.totalExpenses.toFixed(2)}`);
  doc.text(`Total Mileage: ${summary.totalMiles} miles`);
  doc.text(`Total Fuel: ${summary.totalFuel} gallons`);
  doc.moveDown(1);

  // Monthly Summary
  doc.fontSize(16).text('Monthly Summary', { underline: true });
  monthly.forEach(item => {
    doc.fontSize(12).text(`${item._id} - Mileage: ${item.totalMileage}, Fuel: ${item.totalFuel} gal, Expenses: $${item.totalExpenses}`);
  });
  doc.moveDown(1);

  // Quarterly Summary
  doc.fontSize(16).text('Quarterly Summary', { underline: true });
  quarterly.forEach(item => {
    doc.fontSize(12).text(`${item._id} - Mileage: ${item.totalMileage}, Fuel: ${item.totalFuel} gal, Expenses: $${item.totalExpenses}`);
  });
  doc.moveDown(1);

  // Yearly Summary
  doc.fontSize(16).text('Yearly Summary', { underline: true });
  yearly.forEach(item => {
    doc.fontSize(12).text(`${item._id} - Mileage: ${item.totalMileage}, Fuel: ${item.totalFuel} gal, Expenses: $${item.totalExpenses}`);
  });
  doc.moveDown(1);

  // Category Breakdown
  doc.fontSize(16).text('Top Categories', { underline: true });
  categories.forEach(cat => {
    doc.fontSize(12).text(`${cat._id}: $${cat.total.toFixed(2)} (${cat.count} entries)`);
  });
  doc.moveDown(1);

  // Fuel Efficiency
  doc.fontSize(16).text('Fuel Efficiency', { underline: true });
  const eff = fuelStats?.avgEfficiency?.toFixed(2) || 'N/A';
  doc.fontSize(12).text(`Average MPG: ${eff}`);
  doc.moveDown(1);

  // Mileage Details
  doc.fontSize(16).text('Mileage Details', { underline: true });
  mileageDetails.forEach(m => {
    doc.fontSize(12).text(`${new Date(m.date).toLocaleDateString()}: ${m.mileageDelta} miles`);
  });
  doc.moveDown(1);

  // Expense List
  doc.fontSize(16).text('All Expenses', { underline: true });
  expenses.forEach(exp => {
    doc.fontSize(12).text(`• ${exp.category} | $${exp.amount} | ${new Date(exp.date).toLocaleDateString()} - ${exp.description}`);
  });

  doc.end();
  return await streamToBuffer(doc);
};

module.exports = { generatePDF };
