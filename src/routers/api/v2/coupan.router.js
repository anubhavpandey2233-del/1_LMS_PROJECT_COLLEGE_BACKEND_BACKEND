const express = require('express');
const { coupanController } = require('../../../controller');
const routers = express.Router()

routers.get("/allcoupan", coupanController.getAllcoupan)

routers.get("/coupan/:id", coupanController.getcoupan)

routers.post("/addcoupan", coupanController.addcoupan)

routers.put("/updatecoupan/:id", coupanController.updatecoupan)

routers.delete("/deletecoupan/:id", coupanController.deletcoupan)

module.exports = routers;