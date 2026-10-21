const fs = require("fs");
const Coupan = require("../model/coupan.model");

const addcoupan = async (req, res) => {
    try {
        const coupan = await Coupan.create(req.body);

        if (!coupan) {
            return res.status(400).json({ sucess: false, data: null, Message: "coupan not added" })
        }

        return res.status(200).json({ sucess: true, data: coupan, Message: "coupan Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAllcoupan = async (req, res) => {
    try {
        const coupan = await Coupan.find();
        if (!coupan) {
            return res.status(400).json({ sucess: false, data: [], Message: "coupan not found." })
        }

        return res.status(200).json({ sucess: true, data: coupan, Message: "All coupan founed." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getcoupan = async (req, res) => {
    try {
        const coupan = await Coupan.findById(req.params.id);

        if (!coupan) {
            return res.status(400).json({ sucess: false, data: [], Message: "coupan not fetched." })
        }

        return res.status(200).json({ sucess: true, data: coupan, Message: "coupan fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatecoupan = async (req, res) => {
    try {
        const coupan = await Coupan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!coupan) {
            return res.status(400).json({ sucess: false, data: [], Message: "coupan not updated." })
        }

        return res.status(200).json({ sucess: true, data: coupan, Message: "coupan updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletcoupan = async (req, res) => {
    try {
        const coupan = await Coupan.findByIdAndDelete(req.params.id);

        if (!coupan) {
            return res.status(400).json({ sucess: false, data: [], Message: "coupan not deleted." })
        }

        return res.status(200).json({ sucess: true, data: coupan, Message: "coupan deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    getAllcoupan,
    getcoupan,
    addcoupan,
    updatecoupan,
    deletcoupan,
}