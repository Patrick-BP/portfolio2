const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// 📄 Export PDF Report
router.get('/download', reportController.generateReport);

// 📊 Web View & JSON Reports
router.get('/monthly', reportController.getMonthlySummary);
router.get('/quarterly', reportController.getQuarterlySummary);
router.get('/yearly', reportController.getYearlySummary);
router.get('/categories', reportController.getTopCategories);
router.get('/efficiency', reportController.getFuelEfficiencyStats);
router.get('/mileage-details', reportController.getMileageDetails);

module.exports = router;
