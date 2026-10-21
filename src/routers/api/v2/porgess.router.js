const express = require('express');
const { progessController } = require('../../../controller');
const routers = express.Router()


routers.get("/allporgess", progessController.getAllprogess)

routers.get("/porgess/:id", progessController.getprogess)

routers.post("/addporgess", progessController.addprogess)

routers.put("/updateporgess/:id", progessController.updateprogess)

routers.delete("/deleteporgess/:id", progessController.deletprogess)

module.exports = routers;