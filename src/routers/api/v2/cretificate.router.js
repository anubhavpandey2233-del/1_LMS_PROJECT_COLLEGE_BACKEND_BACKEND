const express = require('express');
const { certificateController } = require('../../../controller');
const routers = express.Router()


routers.post("/genratecertificate", certificateController.generateCertificate)

// routers.get("/cretificate", (req, res) => {
//     res.status(200).json({Message : "cretificate data fechted"})
// })

// routers.post("/addcretificate", (req,res) => {
//     console.log(req.body);
//     res.status(200).json({Message : "cretificate data Added"})
// })

// routers.put("/updatecretificate/:id", (req,res) => {
//     console.log(req.body, req.params.id);
//     res.status(200).json({Message : "cretificate data Upadted"})
// })

// routers.delete("/deletecretificate/:id", (req,res) => {
//     console.log(req.params.id);
//     res.status(200).json({Message : "cretificate data Deleted"})
// })

module.exports = routers;