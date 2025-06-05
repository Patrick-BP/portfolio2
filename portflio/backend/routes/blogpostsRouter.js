const express = require ("express");
const  BlogPostController  = require ("../controllers/blogpostController");
const storagePosts = require("../middlewares/storagePosts");
const {protect} = require("../middlewares/auth"); // Import your auth middleware

const router = express.Router();



router.get("/", BlogPostController.getAll);
router.get("/:id", BlogPostController.getById);
router.post("/",protect, storagePosts,  BlogPostController.create);
router.patch("/:id",protect, storagePosts, BlogPostController.update);
router.delete("/:id",protect, BlogPostController.delete);

module.exports = router;
