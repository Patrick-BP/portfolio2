const User = require('../models/User');

exports.getUser = async (req, res) => {
  const user = await User.find().select('-password');
  res.json(user[0]);
};

exports.updateUser = async (req, res) => {
 
  const updateData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.file) {
    updateData.profile_picture = `/uploads/profile_pictures/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });
  res.json(user);
};