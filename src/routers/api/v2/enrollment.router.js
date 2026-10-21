const express = require('express');
const { enrollmentController } = require('../../../controller');
const routers = express.Router()


routers.get("/allenrollment", enrollmentController.getAllEnroll)

routers.get("/enrollment/:id", enrollmentController.getEnroll)

routers.post("/addenrollment", enrollmentController.addEnroll)

routers.put("/updateenrollment/:id", enrollmentController.updateEnroll)

routers.delete("/deleteenrollment/:id", enrollmentController.deleteEnroll)

module.exports = routers;