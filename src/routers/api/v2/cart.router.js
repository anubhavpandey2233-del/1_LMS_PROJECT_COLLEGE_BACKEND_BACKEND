const express = require('express');
const { cartController } = require('../../../controller');
const routers = express.Router()


routers.get("/allcart", cartController.getAllCart)

routers.get("/cart/:id", cartController.getCart)

routers.post("/addcart", cartController.addCart)

routers.put("/updatecart/:id", cartController.upadateCart)

routers.delete("/deletecart/:id", cartController.deleteCart)

module.exports = routers;