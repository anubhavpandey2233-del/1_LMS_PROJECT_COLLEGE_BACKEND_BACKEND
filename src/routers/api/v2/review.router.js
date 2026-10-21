const express = require('express');
const { reviewController } = require('../../../controller');
const routers = express.Router()


routers.get("/allreview", reviewController.getAllreview)

routers.get("/review/:id", reviewController.getreview)

routers.post("/addreview", reviewController.addreview)

routers.put("/updatereview/:id", reviewController.updatereview)

routers.delete("/deletereview/:id", reviewController.deletreview)

module.exports = routers;