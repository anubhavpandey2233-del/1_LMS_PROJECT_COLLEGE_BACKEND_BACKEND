const fs = require("fs");
const Like = require("../model/like.model");

const addlike = async (req, res) => {
    try {
        const like = await Like.create(req.body);

        if (!like) {
            return res.status(400).json({ sucess: false, data: null, Message: "like not added" })
        }

        return res.status(200).json({ sucess: true, data: like, Message: "like data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAlllike = async (req, res) => {
    try {
        const like = await Like.find();
        if (!like) {
            return res.status(400).json({ sucess: false, data: [], Message: "All like data found." })
        }

        return res.status(200).json({ sucess: true, data: like, Message: "All like data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getlike = async (req, res) => {
    try {
        const like = await Like.findById(req.params.id);

        if (!like) {
            return res.status(400).json({ sucess: false, data: [], Message: "like data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: like, Message: "like data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatelike = async (req, res) => {
    try {
        const like = await Like.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!like) {
            return res.status(400).json({ sucess: false, data: [], Message: "like data not updated." })
        }

        return res.status(200).json({ sucess: true, data: like, Message: "like data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletlike = async (req, res) => {
    try {
        const like = await Like.findByIdAndDelete(req.params.id);

        if (!like) {
            return res.status(400).json({ sucess: false, data: [], Message: "like data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: like, Message: "like data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addlike,
    getAlllike,
    getlike,
    updatelike,
    deletlike
}