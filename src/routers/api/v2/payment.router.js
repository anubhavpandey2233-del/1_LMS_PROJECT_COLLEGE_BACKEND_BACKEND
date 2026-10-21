const express = require('express');
const { paymentController } = require('../../../controller');
const routers = express.Router()


routers.get("/allpayment", paymentController.getAllPayment)

routers.get("/payment/:id", paymentController.getPayment)

routers.post("/addpayment",paymentController.addPayment)

routers.put("/updatepayment/:id",paymentController.upadatePayment)

routers.delete("/deletepayment/:id",paymentController.deletePayment)

routers.post("/payment-creatOrder", paymentController.CreateOrder)

routers.post("/payment-verify", paymentController.verifyPayment)

module.exports = routers;