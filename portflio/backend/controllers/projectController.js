
const ProjectModel = require("../models/projectsModel");
const Response = require("../models/responseobj");
const fs = require('fs').promises; // Use promises for async/await
const path = require('path');

// Get all ProjectModel
exports.getAllProjects = async (req, res) => {
    try {
        const entries = await ProjectModel.find();
        if (entries.length === 0) {
            return res.status(200).json(new Response(true, "No projects found", null));
        }
        const mapedProjects = entries.map((project) => {
            return {
                _id: project._id,
                title: project.title,
                description: project.description,
                thumbnail: project.thumbnail ? `http://localhost:3000${project.thumbnail}` : null,
                liveUrl: project.liveUrl,
                githubUrl: project.githubUrl,
                category: project.category,
                techStack: project.techStack
            };
        });
        res.status(200).json(new Response(false, "", mapedProjects));
      } catch (error) {
        res.status(500).json(new Response(true, "Failed to fetch projects entries", null));
      }
};

// Get a project by ID
exports.getProjectById = async (req, res) => {

    try {
        const project = await ProjectModel.findById(req.params.id);
        if (!project) {
            return res.status(404).json(new Response (true,"Project not found", null ));
        }
        res.status(200).json(new Response (false, "" , project ));
    } catch (error) {
        res.status(400).json(new Response (true,"There was an Error", null ));
    }
    
};

// Create a new project
exports.createProject = async (req, res) => {
const newProject ={ ...req.body };
newProject.thumbnail = req.file ? `/${req.file.path.split("\\").join("/")}` : null; // Set thumbnail path if file is uploaded

    try {
        const result = await new ProjectModel(newProject).save();
         res.status(201).json(new Response (false, "A New Project was created", result ));
        
    } catch (error) {
        console.error("Error creating project:", error); // Log the error
        res.status(400).json(new Response (true, "There was an Error creating the project. Try Later!", null ));
    }
};

// Update an existing project
exports.updateProject = async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id); // Use await and findById
        if (!project) {
            return res.status(404).json(new Response(true, "Project Not Found!", null)); // Changed error flag to true
        }

        const updateData = { ...req.body };
        // Handle thumbnail update
        if (req.file) {
        updateData.thumbnail =  `/${req.file.path.split("\\").join("/")}` ; // Set thumbnail path if file is uploaded
        }
   
        // Handle techStack update
        if (updateData.techStack) {
            updateData.techStack = Array.isArray(updateData.techStack) ? updateData.techStack : updateData.techStack.split(',').map(item => item.trim());
        }


        const updatedProject = await ProjectModel.findByIdAndUpdate(req.params.id, updateData, { new: true }); // Use { new: true } to return the updated document
        res.status(200).json(new Response(false, "Project was updated successfully", updatedProject)); // Return updated project

    } catch (error) {
        console.error("Error updating project:", error); // Log the error
        res.status(400).json(new Response (true, "There was an Error updating the project. Try Later!", null ));
    }
    
    
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        // 1. Find the project first to get its details
        const project = await ProjectModel.findById(req.params.id);

        if (!project) {
            return res.status(404).json(new Response(true, "Project not found", null));
        }

        // 2. If the project has a thumbnail, delete the thumbnail file
        if (project.thumbnail) {
            try {
                // Assuming thumbnail path is like '/projects/some-folder-name/image.jpg'
                // and static files are served from 'public' directory at the project root.
                // Construct the full path to the thumbnail file relative to the project root.
                const relativeThumbnailPath = project.thumbnail; // e.g., '/projects/some-folder-name/image.jpg'

                // Remove leading slash if present to ensure correct joining with 'public'
                // Handles both '/' and '\' as separators
                const cleanRelativePath = relativeThumbnailPath.startsWith('/') || relativeThumbnailPath.startsWith('\\')
                    ? relativeThumbnailPath.substring(1)
                    : relativeThumbnailPath;

                // Construct the full path relative to the project's CWD (d:/PROJECTS/portfolio2/backend)
                const fullFilePath = cleanRelativePath; // e.g., 'public\projects\some-folder-name\image.jpg' on Windows
                // Check if the file exists before attempting deletion
                await fs.access(fullFilePath, fs.constants.F_OK); // Check file existence using fs constants
                // Delete the thumbnail file
                await fs.unlink(fullFilePath);
                console.log(`Deleted project thumbnail: ${fullFilePath}`); // Optional logging

            } catch (fsError) {
                // Log the error but proceed with DB deletion if the file doesn't exist or deletion fails
                if (fsError.code !== 'ENOENT') { // ENOENT means file not found, which is okay here
                   console.error(`Error deleting project thumbnail file for ${project._id}:`, fsError);
                   // Optionally, you could return an error here if file deletion is critical
                   // return res.status(500).json(new Response(true, "Error deleting project thumbnail file", null));
                } else {
                    console.log(`Project thumbnail file not found for ${project._id} at ${fullFilePath}, skipping deletion.`);
                }
            }
        }

        // 3. Delete the project from the database
        await ProjectModel.findByIdAndDelete(req.params.id);

        res.status(200).json(new Response(false, "Project deleted successfully", null));

    } catch (error) {
        console.error("Error deleting project:", error); // Log the main error
        // Distinguish between not found (already handled) and other errors
        if (error.kind === 'ObjectId' && error.path === '_id') {
             return res.status(400).json(new Response(true, "Invalid Project ID format", null));
        }
        // Use 500 for generic server errors
        res.status(500).json(new Response(true, "An error occurred while deleting the project", null));
    }
};
