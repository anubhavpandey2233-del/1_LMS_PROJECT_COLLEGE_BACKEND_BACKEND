const express = require('express');
const routers = express.Router()


routers.get("/allcard", (req, res) => {
    res.status(200).json({Message : "All card data fechted"})
})

routers.get("/card", (req, res) => {
    res.status(200).json({Message : "card data fechted"})
})

routers.post("/addcard", (req,res) => {
    console.log(req.body);
    res.status(200).json({Message : "card data Added"})
})

routers.put("/updatecard/:id", (req,res) => {
    console.log(req.body, req.params.id);
    res.status(200).json({Message : "card data Upadted"})
})

routers.delete("/deletecard/:id", (req,res) => {
    console.log(req.params.id);
    res.status(200).json({Message : "card data Deleted"})
})

module.exports = routers;