const express = require('express');
const routers = express.Router()


routers.get("/allresult", (req, res) => {
    res.status(200).json({Message : "All result data fechted"})
})

routers.get("/result", (req, res) => {
    res.status(200).json({Message : "result data fechted"})
})

routers.post("/addresult", (req,res) => {
    console.log(req.body);
    res.status(200).json({Message : "result data Added"})
})

routers.put("/updateresult/:id", (req,res) => {
    console.log(req.body, req.params.id);
    res.status(200).json({Message : "result data Upadted"})
})

routers.delete("/deleteresult/:id", (req,res) => {
    console.log(req.params.id);
    res.status(200).json({Message : "result data Deleted"})
})

module.exports = routers;