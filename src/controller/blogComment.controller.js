const Comment = require("../model/blogComment.model");

const getAllcomment = async (req, res) => {
    try {
        const comment = await Comment.find().populate("user_id", "name email")

        if (!comment) {
            return res.status(400).json({ data: null, meassage: "Allcomment Not Get" })
        }

        return res.status(200).json({ data: comment, meassage: "Allcomment Get Sucessfully" })
    } catch (error) {
        return res.status(500).json({ data: null, meassage: "Internal Server Error: " + error.meassage })
    }
}

const getcomment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        console.log(comment);

        if (!comment) {
            return res.status(400).json({ data: null, message: "comment Not get" })
        }

        res.status(200).json({ data: comment, message: 'comment Sucessfully get' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const addcomment = async (req, res) => {
    try {
        const comment = await Comment.create(req.body)

        console.log("comment", comment);

        if (!comment) {
            return res.status(400).json({ data: null, message: "comment Not added" })
        }

        res.status(200).json({ data: comment, message: 'comment added Sucessfully' })
    } catch (error) {

        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const deletecomment = async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(400).json({ data: null, message: "comment Not Deleted" })
        }

        res.status(200).json({ data: comment, message: 'comment Deleted Sucessfully' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

const upadatecomment = async (req, res) => {
    try {

        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        console.log(comment);

        if (!comment) {
            return res.status(400).json({ data: null, message: "comment Not Upadte" })
        }

        res.status(200).json({ data: comment, message: 'comment Sucess Update' })
    } catch (error) {
        res.status(500).json({ data: null, message: "Internal Server Error: " + error.meassage })
    }
}

module.exports = {
    deletecomment,
    upadatecomment,
    addcomment,
    getcomment,
    getAllcomment
}