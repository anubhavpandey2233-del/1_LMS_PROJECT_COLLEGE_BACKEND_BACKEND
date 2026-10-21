const express = require('express');
const routers1 = express.Router()

const category = require("./category.router")
const user = require("./user.router")
const review = require("./review.router")
const course = require("./course.router")
const cart = require("./cart.router")
const payment = require("./payment.router")
const enrollment = require("./enrollment.router")
const section = require("./section.router")
const quiz = require("./quiz.router")
const progess = require("./porgess.router")
const certificate = require("./cretificate.router")
const content = require("./content.router")
const quiz_content = require("./quiz_content.router")
const result = require("./result.router")
const card = require("./card.router")
const blog = require("./blog.router")
const wishlist = require("./wishlist.router")
const terms = require("./terms.router")
const coupan = require("./coupan.router")
const tag = require("./tag.router")
const like = require("./like.router")
const comment = require("./blogComment.router")

routers1.use("/category", category);
routers1.use("/user", user);
routers1.use("/review", review);
routers1.use("/course", course);
routers1.use("/cart", cart);
routers1.use("/payment", payment);
routers1.use("/enrollment", enrollment);
routers1.use("/section", section);
routers1.use("/quiz", quiz);
routers1.use("/progess", progess);
routers1.use("/certificate", certificate);
routers1.use("/content", content);
routers1.use("/quiz_content", quiz_content);
routers1.use("/result", result);
routers1.use("/card", card);
routers1.use("/blog", blog);
routers1.use("/wishlist", wishlist);
routers1.use("/terms", terms);
routers1.use("/coupan", coupan);
routers1.use("/tag", tag);
routers1.use("/like", like);
routers1.use("/comment", comment);

module.exports = routers1