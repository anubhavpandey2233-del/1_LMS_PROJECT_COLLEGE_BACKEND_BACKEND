
const { default: mongoose } = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Types.ObjectId,
            ref: "course",
            required: true
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: "user",
            required: true
        },
        issue_date: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: String,
            default: "A+"
        },
        certificate_url: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

certificateSchema.index(
    { course: 1, user: 1 },
    { unique: true }
);

const Certificate = mongoose.model("certificate", certificateSchema);

module.exports = Certificate;






// const { default: mongoose } = require("mongoose");

// const certificateSchema = new mongoose.Schema(
//     {
//         course: {
//             type: mongoose.Types.ObjectId,
//             ref: 'course',
//         },
//         user: {
//            type: mongoose.Types.ObjectId,
//             ref: 'user',
//         },
//         issue_date: {
//             type: Date,
//             default: Date.now
//         },
//         grade:{
//             type:String
//         }
//     },
//     {
//         timestamps: true,
//         versionKey: false
//     }
// );

// const Certificate = mongoose.model('certificate', certificateSchema);
// module.exports = Certificate  