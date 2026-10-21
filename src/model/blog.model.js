const dayjs = require("dayjs");
const { default: mongoose } = require("mongoose");

const bolgSchema = new mongoose.Schema(
    {
        instructor: {
            type: mongoose.Types.ObjectId,
            ref: 'users'
        },
        tag:{
            type: mongoose.Types.ObjectId,
            ref: 'tag'
        },
        title : {
            type : String
        },
        description:{
            type:String
        },
        content:{
            type: String
        },
        content_file: [{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }],
        view :{
            type : Number,
            default : 0
        },
        date: {
            type: String,
            default: dayjs(Date.now()).format("DD/MM/YYYY")
        }
    },
    {
        timestamps: true,
        versionKey: false,

    }
)

const Blog = mongoose.model("blog", bolgSchema)

module.exports = Blog;