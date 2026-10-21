const express = require('express');
const { quiz_contentcontroller } = require('../../../controller');
const routers = express.Router()


routers.get("/allquiz_content", quiz_contentcontroller.getAllquiz_content)

routers.get("/quiz_content/:id",  quiz_contentcontroller.getquiz_content)

routers.post("/addquiz_content",  quiz_contentcontroller.addquiz_content)

routers.put("/updatequiz_content/:id",  quiz_contentcontroller.updatequiz_content)

routers.delete("/deletequiz_content/:id",  quiz_contentcontroller.deletquiz_content)

module.exports = routers;