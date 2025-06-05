const BlogPostModel =  require ("../models/blogPostModel");
const Response = require("../models/responseobj");
const fs = require('fs').promises; // Use promises for async/await
const path = require('path');

  exports.getAll = async (req, res) => {
    try {
      const posts = await BlogPostModel.find();
      const mapedPosts = posts.map((post) => {
        return {
          _id: post._id,
          title: post.title,
          thumbnail: post.thumbnail ? `http://localhost:3000${post.thumbnail}` : null,
          content: post.content,
          excerpt: post.excerpt,
          published: post.published,
          publishedBy: post.publishedBy,
          tags: post.tags,
          readTime: post.readTime,
          description: post.description,
          createdAt: post.createdAt,
          publishedAt: post.updatedAt,
        };
      });
      
      res.status(200).json(new Response(false, "", mapedPosts));
    } catch (error) {
      res.status(500).json(new Response(true, "There was an error", error ));
    }
  }

  exports.getById = async (req, res) => {
    try {
      const post = await BlogPostModel.findById(req.params.id);
      if (!post) return res.status(400).json(new Response (true, "Post not found", null ));
      res.status(200).json(new Response(false, "", post));
    } catch (error) {
      res.status(400).json(new Response(true, "There was an error", null ));
    }
  }

  exports.create = async (req, res) => {
    const newPost ={ ...req.body };
    newPost.thumbnail = req.file ? `/${req.file.path.split("\\").join("/")}` : null; // Set thumbnail path if file is uploaded
    
    
    try {
       const post = await new  BlogPostModel(newPost).save();
      res.status(200).json(new Response (false, "Blog was created successfully", post));
    } catch (error) {
      res.status(500).json(new Response(true, "There was an Error", error ));
    }
  }

  exports.update = async (req, res) => {
    try {
      const updateData = { ...req.body };
      // Handle thumbnail update
      if (req.file) {
      updateData.thumbnail =  `/${req.file.path.split("\\").join("/")}` ; // Set thumbnail path if file is uploaded
      }
      const post = await BlogPostModel.findByIdAndUpdate(req.params.id, updateData , { new: true });
      res.status(200).json(new Response(false, "post was updated successfully", post));
    } catch (error) {
      res.status(400).json(new Response(true, "Invalid post data", error ));
    }
  }

  exports.delete = async (req, res) => {
    try {
      // 1. Find the project first to get its details
      const post = await  BlogPostModel.findById(req.params.id);

      if (!post) {
          return res.status(404).json(new Response(true, "Post not found", null));
      }

      // 2. If the project has a thumbnail, delete the thumbnail file
      if (post.thumbnail) {
          try {
              // Assuming thumbnail path is like '/projects/some-folder-name/image.jpg'
              // and static files are served from 'public' directory at the project root.
              // Construct the full path to the thumbnail file relative to the project root.
              const relativeThumbnailPath = post.thumbnail; // e.g., '/projects/some-folder-name/image.jpg'

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
              console.log(`Deleted post thumbnail: ${fullFilePath}`); // Optional logging

          } catch (fsError) {
              // Log the error but proceed with DB deletion if the file doesn't exist or deletion fails
              if (fsError.code !== 'ENOENT') { // ENOENT means file not found, which is okay here
                 console.error(`Error deleting post thumbnail file for ${post._id}:`, fsError);
                 // Optionally, you could return an error here if file deletion is critical
                 // return res.status(500).json(new Response(true, "Error deleting project thumbnail file", null));
              } else {
                  console.log(`Project thumbnail file not found for ${post._id} at ${fullFilePath}, skipping deletion.`);
              }
          }
      }

      // 3. Delete the project from the database
      await BlogPostModel.findByIdAndDelete(req.params.id);

      res.status(200).json(new Response(false, "Post deleted successfully", null));

  } catch (error) {
      console.error("Error deleting post:", error); // Log the main error
      // Distinguish between not found (already handled) and other errors
      if (error.kind === 'ObjectId' && error.path === '_id') {
           return res.status(400).json(new Response(true, "Invalid Post ID format", null));
      }
      // Use 500 for generic server errors
      res.status(500).json(new Response(true, "An error occurred while deleting the post", null));
  }
  };
