const express = require('express');
const { sectioncontroller } = require('../../../controller');
const routers = express.Router()


routers.get("/allsection", sectioncontroller.getAllsection)

routers.get("/section/:id", sectioncontroller.getsection)

routers.post("/addsection", sectioncontroller.addsection)

routers.put("/updatesection/:id", sectioncontroller.updatesection)

routers.delete("/deletesection/:id", sectioncontroller.deletsection)

module.exports = routers;