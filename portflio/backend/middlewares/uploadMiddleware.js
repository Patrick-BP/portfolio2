const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, './public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'avatar') {
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Only images allowed for avatar'), false);
  } else if (file.fieldname === 'resume') {
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('Only PDFs allowed for resume'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);

module.exports = upload;