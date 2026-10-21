const express = require('express');
const { tagConroller } = require('../../../controller');
const routers = express.Router()


routers.get("/alltag", tagConroller.getAlltag)

routers.get("/tag/:id", tagConroller.gettag)

routers.post("/addtag", tagConroller.addtag)

routers.put("/updatetag/:id", tagConroller.updatetag)

routers.delete("/deletetag/:id", tagConroller.delettag)

module.exports = routers;