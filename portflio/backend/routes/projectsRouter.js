const express = require ("express");
const storageProjects = require("../middlewares/storageProjects");
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require ("../controllers/projectController");
const {protect} = require("../middlewares/auth"); // Import your auth middleware


const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Apply logging and multer middleware to the create route
router.post("/", protect, storageProjects, createProject);

// Apply multer middleware to the update route
router.patch("/:id", protect, storageProjects, updateProject);

router.delete("/:id", protect, deleteProject);

module.exports = router;