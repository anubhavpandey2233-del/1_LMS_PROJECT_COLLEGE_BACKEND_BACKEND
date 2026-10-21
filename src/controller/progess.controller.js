const Progess = require("../model/progess.model");


const getAllprogess = async (req, res) => {
    try {
        const progess = await Progess.find();
        if (!progess) {
            return res.status(400).json({ sucess: false, data: [], Message: "All progess data found." })
        }

        return res.status(200).json({ sucess: true, data: progess, Message: "All progess data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getprogess = async (req, res) => {
    try {
        const progess = await Progess.findById(req.params.id);

        if (!progess) {
            return res.status(400).json({ sucess: false, data: [], Message: "progess data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: progess, Message: "progess data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const addprogess = async (req, res) => {
    try {
        const progess = await Progess.create(req.body);

        if (!progess) {
            return res.status(400).json({ sucess: false, data: null, Message: "progess not added" })
        }

        return res.status(200).json({ sucess: true, data: progess, Message: "progess data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const updateprogess = async (req, res) => {
    try {
        const progess = await Progess.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!progess) {
            return res.status(400).json({ sucess: false, data: [], Message: "progess data not updated." })
        }

        return res.status(200).json({ sucess: true, data: progess, Message: "progess data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletprogess = async (req, res) => {
    try {
        const progess = await Progess.findByIdAndDelete(req.params.id);

        if (!progess) {
            return res.status(400).json({ sucess: false, data: [], Message: "progess data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: progess, Message: "progess data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addprogess,
    getAllprogess,
    getprogess,
    updateprogess,
    deletprogess
}