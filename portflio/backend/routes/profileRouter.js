const express = require("express");
const ProfileController = require("../controllers/profileController");
const upload = require("../middlewares/storageFiles"); // New middleware for multiple files

const router = express.Router();

router.get("/", ProfileController.getAll);
router.get("/:id", ProfileController.getById);
router.post("/", ProfileController.create);
router.patch("/:id", upload, ProfileController.update); // Using a single middleware for both files
router.delete("/:id", ProfileController.delete);

module.exports = router;
