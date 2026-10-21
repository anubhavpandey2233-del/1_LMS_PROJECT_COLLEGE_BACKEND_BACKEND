const { default: mongoose, sanitizeFilter } = require("mongoose");

const categoriesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        desciption: {
            type: String,
        },
        parent_id: {
            type: mongoose.Types.ObjectId,
            ref: "categories",
            default: null
        },
        category_img:  [{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }],
        is_active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Categories = mongoose.model("categories", categoriesSchema)

module.exports = Categories;