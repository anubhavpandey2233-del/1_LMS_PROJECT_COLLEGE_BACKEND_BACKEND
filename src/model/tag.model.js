const { default: mongoose } = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        tag:{
            type:String
        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Tag = mongoose.model("tag", tagSchema)

module.exports = Tag;