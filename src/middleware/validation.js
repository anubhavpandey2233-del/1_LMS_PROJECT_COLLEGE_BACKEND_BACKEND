const Joi = require("joi");

const pick = (reqObj, schemakeys) => {
    return schemakeys.reduce((obj, k) => {
        if (reqObj && reqObj.hasOwnProperty(k)) {
            obj[k] = reqObj[k];
        }
        return obj;
    }, {})
}

const validation = (schema) => (req, res, next) => {
    try {
        const obj = pick(req, Object.keys(schema));
        console.log(obj);

        const { error, value } = Joi.compile(schema).prefs({ abortEarly: false }).validate(obj);

        if (error) {
            const errMsg = error.details.map(v => v.message).join(" ,");

            return res.status(400).json({
                success: false,
                data: null,
                Error: "Valiadtion Error : " + errMsg
            })

        }

        Object.assign(req, value);

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            Error: "Internal Server Error : " + error.message
        })
    }
}

module.exports = validation;