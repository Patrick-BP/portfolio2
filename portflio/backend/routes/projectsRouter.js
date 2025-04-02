const express = require ("express");
const storageProjects = require("../middlewares/storageProjects");
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require ("../controllers/projectController");



const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Apply logging and multer middleware to the create route
router.post("/", storageProjects, createProject);

// Apply multer middleware to the update route
router.patch("/:id", storageProjects, updateProject);

router.delete("/:id", deleteProject);

module.exports = router;