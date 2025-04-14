const Vehicle = require('../models/Vehicle');

exports.addVehicle = async (req, res) => {
  const vehicle = new Vehicle({ ...req.body, user: req.user.id });
  await vehicle.save();
  res.json(vehicle);
};

exports.getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ user: req.user.id });
  res.json(vehicles);
};

exports.updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  res.json(vehicle);
};