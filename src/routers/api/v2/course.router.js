const express = require('express');
const { coursecontroller } = require('../../../controller');
const routers = express.Router();
const upload = require('../../../middleware/upload');


routers.get("/allcourse", coursecontroller.getAllCouser)

routers.get("/getcourse/:id", coursecontroller.getCouser)

routers.post("/addcourse", upload.array('course_img', 10), coursecontroller.addCouser)

routers.put("/updatecourse/:id", upload.array('course_img', 10), coursecontroller.updateCouser)

routers.delete("/deletecourse/:id", coursecontroller.deletCouser)

routers.put("/updateCouserStauts/:id", coursecontroller.updateCouserStauts)

module.exports = routers;

