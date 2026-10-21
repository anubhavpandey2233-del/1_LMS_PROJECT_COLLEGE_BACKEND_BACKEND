const express = require('express');
const { blogCommentController } = require('../../../controller');
const routers = express.Router()


routers.get("/allcomment", blogCommentController.getAllcomment)

routers.get("/comment/:id", blogCommentController.getcomment)

routers.post("/addcomment", blogCommentController.addcomment)

routers.put("/updatecomment/:id", blogCommentController.upadatecomment)

routers.delete("/deletecomment/:id", blogCommentController.deletecomment)

module.exports = routers;