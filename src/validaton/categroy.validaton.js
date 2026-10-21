const Joi = require("joi")
const { param } = require("../routers/api/v2/category.router")

const addCategorySchema = {
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        desciption: Joi.string().required(),
        parent_id: Joi.string().optional(),
        category_img: Joi.any().optional()
    })
}

const updateCategorySchema = {
    params: Joi.object().keys({
        id: Joi.string().required().min(24)
    }),
    body: Joi.object().keys({
        name: Joi.string().required().trim(),
        desciption: Joi.string().required(),
        parent_id: Joi.string().optional(),
        category_img: Joi.any().optional()
    })
}

const daleteCategorySchema = {
    params: Joi.object().keys({
        id: Joi.string().required().min(24)
    })
}

module.exports = {
    addCategorySchema,
    updateCategorySchema,
    daleteCategorySchema
}