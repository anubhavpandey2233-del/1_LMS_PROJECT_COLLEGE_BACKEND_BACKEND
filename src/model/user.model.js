const { default: mongoose, sanitizeFilter } = require("mongoose");
const { TrustProductsEntityAssignmentsListInstance } = require("twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments");

const usersSchema = new mongoose.Schema(
    {
        pfp: [{
            public_id: {
                type: String,
            },
            url: {
                type: String,
            }
        }],
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            // required:true,
        },
        password: {
            type: String,
            trim: true
        },
        phone_no: {
            type: String
        },
        dob: {
            type: String,
            trim: TrustProductsEntityAssignmentsListInstance
        },
        gender: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            default: "user"
        },
        OTP: {
            type: Number
        },
        googleID: {
            type: String
        },
        facebookID: {
            type: String
        },
        twitterID : {
            type : String
        },
        linkedInID : {
            type: String
        },
        is_verify: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        about: {
            type: String
        },
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

const users = mongoose.model("users", usersSchema)

module.exports = users;