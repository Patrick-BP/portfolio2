const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePDF = (expenses, fuelEfficiency, categoryBreakdown, range) => {
  const doc = new PDFDocument();

  const filePath = `./reports/report-${Date.now()}.pdf`;
  doc.pipe(fs.createWriteStream(filePath));

  // Title
  doc.fontSize(20).text('Rideshare Expenses Report', { align: 'center' });

  // Date Range
  doc.fontSize(12).text(`Report Range: ${range}`, { align: 'center' });
  doc.moveDown(2);

  // Expenses Table
  doc.fontSize(16).text('Expenses Summary');
  doc.moveDown(1);

  expenses.forEach(exp => {
    doc.text(`Category: ${exp.category}`);
    doc.text(`Date: ${exp.date}`);
    doc.text(`Amount: $${exp.amount}`);
    doc.text(`Description: ${exp.description}`);
    doc.text('---');
  });

  doc.moveDown(2);

  // Fuel Efficiency
  doc.text(`Fuel Efficiency: ${fuelEfficiency.toFixed(2)} miles per gallon`);
  doc.moveDown(1);

  // Category Breakdown
  doc.text('Category Breakdown:');
  categoryBreakdown.forEach(item => {
    doc.text(`${item._id}: $${item.total}`);
  });

  // Finalize PDF
  doc.end();

  return filePath;  // Return the path of the generated PDF
};

module.exports = generatePDF;
