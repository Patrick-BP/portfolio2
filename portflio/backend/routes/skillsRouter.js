const express = require("express");
const SkillsController = require('../controllers/skillController');
const {protect} = require("../middlewares/auth"); // Import your auth middleware

const router = express.Router();

router.get("/", SkillsController.getAll);
router.get("/:id", SkillsController.getById);
router.post("/",protect, SkillsController.create);
router.patch("/:id",protect, SkillsController.update);
router.delete("/:id",protect, SkillsController.delete);

module.exports = router
