const express = require('express');
const router = express.Router();
const authorController = require("../controllers/authorController")
const blogController = require("../controllers/blogController")
const loginController = require("../controllers/loginController")
const middleWare = require("../middleware/autharization")

//Author-Blog route Hndlers
router.post("/author", authorController)
router.post("/blogs", middleWare,  blogController.createBlogs)
router.get("/blogs", middleWare, blogController.getBlogs)
router.put("/blogs/:blogId", middleWare, blogController.updateBlogs)
router.delete("/blogs/:blogId",middleWare, blogController.deleteBlogs)
router.delete("/blogs", middleWare, blogController.deleteBlogsQP)

router.post("/login", loginController )


module.exports = router;