const express = require("express");
const multer = require("multer");
const {
  createPost,
  getPosts,
  searchPosts,
  getPostById,
  deletePost,
  updatePost,
} = require("../controllers/postController");

// Configure multer for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post("/createPost", upload.array("images", 11), createPost);
router.get("/getPosts", getPosts);
router.get("/post/:id", getPostById); // Route for fetching a post by Id
router.get("/search/:query", searchPosts);
router.delete("/:id", deletePost);
router.put("/:id", upload.array("images"), updatePost);

module.exports = router;
