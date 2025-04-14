
const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/me', auth, controller.getUser);
router.put('/me', auth, upload.single('profile_picture'), controller.updateUser);

module.exports = router;



// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');
// const User = require('../models/User');
// const auth = require('../middlewares/authMiddleware');

// // Multer storage for profile picture
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/profile_pictures');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage: storage });

// // Get user profile
// router.get('/', auth, async (req, res) => {
//   const user = await User.findById(req.user._id);
//   res.json(user);
// });

// // Update user profile picture
// router.put('/profile-picture', auth, upload.single('profile_picture'), async (req, res) => {
//   const user = await User.findById(req.user._id);
//   const imagePath = `/uploads/profile_pictures/${req.file.filename}`;

//   user.profile_picture = imagePath;
//   await user.save();

//   res.json({ msg: 'Profile picture updated', profile_picture: imagePath });
// });

// module.exports = router;
