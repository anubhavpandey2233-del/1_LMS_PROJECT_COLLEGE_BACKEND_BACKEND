const { default: mongoose, sanitizeFilter } = require("mongoose");

const quizContentSchema = new mongoose.Schema(
    {
        quiz: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'quiz',
            required: true
        },
        question: {
            type: String,

        },
        options: [
            {
                type: String,
            }
        ],
        Answer: {
            type: String,

        },
        Mark: {
            type: Number
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const QuizContent = mongoose.model("quizContent", quizContentSchema)

module.exports = QuizContent;