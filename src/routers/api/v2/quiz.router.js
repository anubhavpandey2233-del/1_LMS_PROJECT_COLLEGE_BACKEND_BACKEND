const express = require('express');
const { quizcontroller } = require('../../../controller');
const routers = express.Router()


routers.get("/allquiz", quizcontroller.getAllquiz)

routers.get("/quiz/:id", quizcontroller.getquiz)

routers.post("/addquiz",quizcontroller.addquiz)

routers.put("/updatequiz/:id", quizcontroller.updatequiz)

routers.delete("/deletequiz/:id", quizcontroller.deletquiz)

module.exports = routers;