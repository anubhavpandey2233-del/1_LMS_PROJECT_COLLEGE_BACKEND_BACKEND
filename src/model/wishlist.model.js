const { default: mongoose } = require("mongoose");

const whistlistSchema = new mongoose.Schema({

    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
    },
    items: [{
        course: {
            type: mongoose.Types.ObjectId,
            ref: 'course',
        },
    }],
},
    {
        timestamps: true,
        versionKey: false
    }
);

const Whistlist = mongoose.model('whistlist', whistlistSchema);
module.exports = Whistlist