const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")

//Author-Blog route Hndlers
router.post("/author", authorController)
router.post("/blogs", blogController.createBlogs)
router.get("/blogs", blogController.getBlogs)
router.put("/blogs/:blogId", blogController.updateBlogs)
router.delete("/blogs/:blogId", blogController.deleteBlogs)
router.delete("/blogs", blogController.deleteBlogsQP)

module.exports = router;