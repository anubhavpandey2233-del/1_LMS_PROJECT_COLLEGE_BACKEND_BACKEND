const fs = require("fs");
const Section = require("../model/section.model");

const addsection = async (req, res) => {
    try {
        const section = await Section.create(req.body);

        if (!section) {
            return res.status(400).json({ sucess: false, data: null, Message: "section not added" })
        }

        return res.status(200).json({ sucess: true, data: section, Message: "section data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAllsection = async (req, res) => {
    try {
        const section = await Section.find();
        if (!section) {
            return res.status(400).json({ sucess: false, data: [], Message: "All section data found." })
        }

        return res.status(200).json({ sucess: true, data: section, Message: "All section data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getsection = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);

        if (!section) {
            return res.status(400).json({ sucess: false, data: [], Message: "section data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: section, Message: "section data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatesection = async (req, res) => {
    try {
        const section = await Section.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!section) {
            return res.status(400).json({ sucess: false, data: [], Message: "section data not updated." })
        }

        return res.status(200).json({ sucess: true, data: section, Message: "section data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletsection = async (req, res) => {
    try {
        const section = await Section.findByIdAndDelete(req.params.id);

        if (!section) {
            return res.status(400).json({ sucess: false, data: [], Message: "section data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: section, Message: "section data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addsection,
    getAllsection,
    getsection,
    updatesection,
    deletsection
}