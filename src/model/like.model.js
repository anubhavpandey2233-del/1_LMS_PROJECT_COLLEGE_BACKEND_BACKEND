const dayjs = require("dayjs");
const { default: mongoose } = require("mongoose");

const likeSchema = new mongoose.Schema(
    {
        user_id: [{
            type: mongoose.Types.ObjectId,
            ref: 'users'
        }],
        blog_id:{
            type: mongoose.Types.ObjectId,
            ref: 'blog'
        },
        like : {
            type : Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Like = mongoose.model("like", likeSchema)

module.exports = Like;