const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.post('/', auth, upload.single('receipt'), controller.addExpense);
router.get('/', auth, controller.getExpenses);
router.patch('/:id', auth, upload.single('receipt'), controller.updateExpense);
router.delete('/:id', auth, controller.deleteExpense);

module.exports = router;