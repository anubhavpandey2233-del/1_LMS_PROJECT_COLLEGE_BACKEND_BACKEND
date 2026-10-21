const QuizContent = require("../model/quiz_content.model");

const addquiz_content = async (req, res) => {
    try {
        const quiz_content = await QuizContent.create(req.body);

        if (!quiz_content) {
            return res.status(400).json({ sucess: false, data: null, Message: "quiz_content not added" })
        }

        return res.status(200).json({ sucess: true, data: quiz_content, Message: "quiz_content data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAllquiz_content = async (req, res) => {
    try {
        const quiz_content = await QuizContent.find();
        
        if (!quiz_content) {
            return res.status(400).json({ sucess: false, data: [], Message: "All quiz_content data found." })
        }

        return res.status(200).json({ sucess: true, data: quiz_content, Message: "All quiz_content data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getquiz_content = async (req, res) => {
    try {
        const quiz_content = await QuizContent.findById(req.params.id);

        if (!quiz_content) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz_content data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: quiz_content, Message: "quiz_content data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatequiz_content = async (req, res) => {
    try {
        const quiz_content = await QuizContent.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!quiz_content) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz_content data not updated." })
        }

        return res.status(200).json({ sucess: true, data: quiz_content, Message: "quiz_content data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletquiz_content = async (req, res) => {
    try {
        const quiz_content = await QuizContent.findByIdAndDelete(req.params.id);

        if (!quiz_content) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz_content data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: quiz_content, Message: "quiz_content data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    getquiz_content,
    getAllquiz_content,
    addquiz_content,
    updatequiz_content,
    deletquiz_content
}