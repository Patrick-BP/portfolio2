const express = require("express");
const SkillsController = require('../controllers/skillController');

const router = express.Router();

router.get("/", SkillsController.getAll);
router.get("/:id", SkillsController.getById);
router.post("/", SkillsController.create);
router.patch("/:id", SkillsController.update);
router.delete("/:id", SkillsController.delete);

module.exports = router
