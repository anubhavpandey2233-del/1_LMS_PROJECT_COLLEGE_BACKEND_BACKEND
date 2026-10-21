const Review = require("../model/review.model");

const getAllreview = async (req, res) => {
    try {
        const review = await Review.find().populate("user", "name email")
        if (!review) {
            return res.status(400).json({ sucess: false, data: [], Message: "All review data found." })
        }

        return res.status(200).json({ sucess: true, data: review, Message: "All review data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getreview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(400).json({ sucess: false, data: [], Message: "review data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: review, Message: "review data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const addreview = async (req, res) => {
    try {
        const review = await Review.create(req.body);

        if (!review) {
            return res.status(400).json({ sucess: false, data: null, Message: "review not added" })
        }

        return res.status(200).json({ sucess: true, data: review, Message: "review data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const updatereview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!review) {
            return res.status(400).json({ sucess: false, data: [], Message: "review data not updated." })
        }

        return res.status(200).json({ sucess: true, data: review, Message: "review data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletreview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(400).json({ sucess: false, data: [], Message: "review data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: review, Message: "review data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addreview,
    getAllreview,
    getreview,
    updatereview,
    deletreview
}