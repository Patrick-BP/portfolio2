const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicleController');
const auth = require('../middlewares/authMiddleware');

router.post('/', auth, controller.addVehicle);
router.get('/', auth, controller.getVehicles);
router.patch('/', auth, controller.updateVehicle);

module.exports = router;