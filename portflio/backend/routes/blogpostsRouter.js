const express = require ("express");
const  BlogPostController  = require ("../controllers/blogpostController");
const storagePosts = require("../middlewares/storagePosts");
const router = express.Router();



router.get("/", BlogPostController.getAll);
router.get("/:id", BlogPostController.getById);
router.post("/", storagePosts,  BlogPostController.create);
router.patch("/:id", storagePosts, BlogPostController.update);
router.delete("/:id", BlogPostController.delete);

module.exports = router;
