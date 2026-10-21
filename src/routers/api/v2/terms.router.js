
const express = require('express');
const { termscontroller } = require('../../../controller');
const routers = express.Router()

routers.get("/allTerms",termscontroller.getAllTerms)

routers.get("/Terms/:id", termscontroller.getTerms)

routers.post("/addTerms", termscontroller.addTerms)

routers.put("/updateTerms/:id", termscontroller.updateTerms)

routers.delete("/deleteTerms/:id", termscontroller.deletTerms)

module.exports = routers;