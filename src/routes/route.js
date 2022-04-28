const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const loginController = require("../controllers/loginController")

//Author-Blog route Hndlers
router.post("/author", authorController)
router.post("/blogs", blogController.createBlogs)
router.get("/blogs", blogController.getBlogs)
router.put("/blogs/:blogId", blogController.updateBlogs)
router.delete("/blogs/:blogId", blogController.deleteBlogs)
router.delete("/blogs", blogController.deleteBlogsQP)
router.post("/Login", loginController.authorLogin )


module.exports = router;