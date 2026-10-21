const express = require('express');
const { categoriescontroller } = require('../../../controller');
const auth = require('../../../middleware/auth');
const upload = require('../../../middleware/upload');
const validation = require('../../../middleware/validation');
const { addCategorySchema, updateCategorySchema, daleteCategorySchema } = require('../../../validaton/categroy.validaton');
const routers = express.Router()


routers.get("/allcatgroy", categoriescontroller.getAllCategories)

routers.get("/catgroy/:id", categoriescontroller.getcategories)

// routers.post("/addcategory",validation(addCategorySchema),upload.single('category_img') , categoriescontroller.addcategories)
routers.post("/addcategory", validation(addCategorySchema), upload.single('category_img'), categoriescontroller.addcategories)

// routers.put("/updatecategory/:id", upload.single('category_img') , categoriescontroller.updatecategories)
routers.put("/updatecategory/:id", validation(updateCategorySchema), upload.single('category_img'), categoriescontroller.updatecategories)

// routers.delete("/deletecategory/:id", categoriescontroller.deletcategories)
routers.delete("/deletecategory/:id", validation(daleteCategorySchema), categoriescontroller.deletcategories)

module.exports = routers;