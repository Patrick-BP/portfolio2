const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).fields([
  { name: "avatar", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

module.exports = upload;
