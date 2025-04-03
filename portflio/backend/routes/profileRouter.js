const express = require("express");
const ProfileController = require("../controllers/profileController");
const upload = require("../middlewares/storageFiles"); // New middleware for multiple files
const {protect} = require("../middlewares/auth"); // Import your auth middleware

const router = express.Router();

router.get("/", ProfileController.getAll);
router.get("/:id", ProfileController.getById);
router.post("/",protect, ProfileController.create);
router.patch("/:id",protect, upload, ProfileController.update); // Using a single middleware for both files
router.delete("/:id",protect, ProfileController.delete);

module.exports = router;
