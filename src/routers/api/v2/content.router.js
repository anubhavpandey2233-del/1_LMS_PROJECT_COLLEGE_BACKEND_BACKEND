const express = require('express');
const { contentcontroller } = require('../../../controller');
const upload = require('../../../middleware/upload');
const routers = express.Router()


routers.get("/allcontent", contentcontroller.getAllcontent)

routers.get("/content/:id", contentcontroller.getcontent)

routers.post("/addcontent", upload.single('content_file'),contentcontroller.addcontent)

routers.put("/updatecontent/:id", upload.single('content_file'),contentcontroller.updatecontent)

routers.delete("/deletecontent/:id", contentcontroller.deletcontent)

module.exports = routers;