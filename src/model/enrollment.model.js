const { default: mongoose } = require("mongoose");

const enrollSchema = new mongoose.Schema(
    {
        course: [
            {
                course_id: {
                    type: mongoose.Types.ObjectId,
                    ref: 'course',
                }
            }
        ],
        enrollment_no: {
            type: String,
            trim: true,
            unique: true
        },
        enrollment_Date: {
            type: Date,
            default: Date.now
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'user',
        },
        paymentId: {
            type: String
        },
        payment_status: {
            type: String,
            default: 'pending'
        },

        progress: [{
            prercentage: {
                type: Number,
                default: 0,
            },
            totalleactue: {
                type: Number,
                default: 0,
            },
            completedLectures: {
                type: Number,
                default: 0,
            },
            course_id: {
                type: mongoose.Types.ObjectId,
                ref: 'course',
            }
        }]

    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Enroll = mongoose.model('enrollment', enrollSchema);
module.exports = Enroll  