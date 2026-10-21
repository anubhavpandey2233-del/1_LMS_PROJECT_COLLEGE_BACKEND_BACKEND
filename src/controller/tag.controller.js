const Tag = require("../model/tag.model");
const tag = require("../model/tag.model");

const getAlltag = async (req, res) => {
    try {
        const tag = await Tag.find();

        if (!tag) {
            return res.status(400).json({ sucess: false, data: [], Message: "All tag data found." })
        }

        return res.status(200).json({ sucess: true, data: tag, Message: "All tag data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const gettag = async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);

        if (!tag) {
            return res.status(400).json({ sucess: false, data: [], Message: "tag data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: tag, Message: "tag data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const addtag = async (req, res) => {
    try {
        const tag = await Tag.create(req.body);

        if (!tag) {
            return res.status(400).json({ sucess: false, data: null, Message: "tag not added" })
        }

        return res.status(200).json({ sucess: true, data: tag, Message: "tag data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const updatetag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!tag) {
            return res.status(400).json({ sucess: false, data: [], Message: "tag data not updated." })
        }

        return res.status(200).json({ sucess: true, data: tag, Message: "tag data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const delettag = async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);

        if (!tag) {
            return res.status(400).json({ sucess: false, data: [], Message: "tag data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: tag, Message: "tag data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addtag,
    getAlltag,
    gettag,
    updatetag,
    delettag
}