const { default: mongoose } = require("mongoose");

const blogCommentSchema = new mongoose.Schema(
    {
        blog_id: {
            type: mongoose.Types.ObjectId,
            ref: 'blog',
        },
        user_id: {
           type: mongoose.Types.ObjectId,
            ref: 'users',
        },
        description:{
            type:String
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Comment = mongoose.model('blogComment', blogCommentSchema);
module.exports = Comment  