const express = require('express');
const { blogController } = require('../../../controller');
const routers = express.Router()
const upload = require('../../../middleware/upload');

routers.get("/allblog", blogController.getAllBlog)

routers.get("/blog/:id", blogController.getBlog)

routers.post("/addblog", upload.array('content_file', 10), blogController.addBlog)

routers.put("/updateblog/:id", upload.array('content_file', 10), blogController.updateBlog)

routers.delete("/deleteblog/:id", blogController.deleteBlog)

module.exports = routers;