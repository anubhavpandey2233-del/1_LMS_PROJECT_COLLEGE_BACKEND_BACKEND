
const express = require("express");
const { reviewController } = require("../../../controller");
const auth = require("../../../middleware/auth");

const routers = express.Router();

routers.get("/allreview", reviewController.getAllreview);

routers.get("/review/:id", reviewController.getreview);

routers.post(
    "/addreview",
    auth(["Student", "student", "user"]),
    reviewController.addreview
);

routers.put(
    "/updatereview/:id",
    auth(["Student", "student", "user"]),
    reviewController.updatereview
);

routers.delete(
    "/deletereview/:id",
    auth(["Student", "student", "user"]),
    reviewController.deletreview
);

module.exports = routers;
