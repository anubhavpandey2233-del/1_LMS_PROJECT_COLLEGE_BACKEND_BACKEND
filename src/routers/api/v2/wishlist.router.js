const express = require('express');
const { whislistContoller } = require('../../../controller');
const routers = express.Router()

routers.get("/allwishlist", whislistContoller.getAllwhistlist)

routers.post("/addwishlist", whislistContoller.addWhistlist)

routers.put("/updatewishlist/:id", whislistContoller.updateWhistlist)

routers.delete("/deletewishlist/:id", whislistContoller.deleteWhistlist)

module.exports = routers;