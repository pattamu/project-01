const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const loginController = require("../controllers/loginController")
const middleWare = require("../middleware/autharization")

//Author-Blog route Hndlers
router.post("/authors", authorController)
router.post("/blogs", middleWare,  blogController.createBlogs)
router.get("/blogs", middleWare, blogController.getBlogs)
router.put("/blogs/:blogId", middleWare, blogController.updateBlogs)
router.delete("/blogs/:blogId",middleWare, blogController.deleteBlog)
router.delete("/blogs", middleWare, blogController.deleteBlogs)

router.post("/login", loginController )


module.exports = router;