const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');
const multer = require('multer');

// Set up multer for file upload
const upload = multer({ dest: 'uploads/csv/' });

// Generate report (PDF)
router.post('/generate/:range', auth, (req, res) => reportController.generateReport(req, res, req.params.range));

// Category breakdown report
router.get('/category-breakdown', auth, reportController.getCategoryBreakdown);

// Fuel efficiency report
router.get('/fuel-efficiency', auth, reportController.getFuelEfficiency);

// CSV import (for uploading CSV file)
router.post('/import-csv', auth, upload.single('csv_file'), reportController.importCSV);

// CSV export (for downloading CSV file)
router.get('/export-csv', auth, reportController.exportCSV);

module.exports = router;
