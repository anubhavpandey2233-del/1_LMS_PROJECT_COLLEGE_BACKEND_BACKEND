const express = require('express');
const { likeController } = require('../../../controller');
const routers = express.Router()


routers.get("/alllike", likeController.getAlllike)

routers.get("/like/:id", likeController.getlike)

routers.post("/addlike", likeController.addlike)

routers.put("/updatelike/:id", likeController.updatelike)

routers.delete("/deletelike/:id", likeController.deletlike)

module.exports = routers;