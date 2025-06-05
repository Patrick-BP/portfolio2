const multer = require('multer');

var diskstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/projects');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname+"-"+Date.now());
  }
});

const storage = multer({ storage:diskstorage}).single('thumbnail');


module.exports = storage;