const fs = require("fs");
const Quiz = require("../model/quiz.model");

const addquiz = async (req, res) => {
    try {
        const quiz = await Quiz.create(req.body);

        if (!quiz) {
            return res.status(400).json({ sucess: false, data: null, Message: "quiz not added" })
        }

        return res.status(200).json({ sucess: true, data: quiz, Message: "quiz data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAllquiz = async (req, res) => {
    try {
        const quiz = await Quiz.find();
        
        if (!quiz) {
            return res.status(400).json({ sucess: false, data: [], Message: "All quiz data found." })
        }

        return res.status(200).json({ sucess: true, data: quiz, Message: "All quiz data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getquiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: quiz, Message: "quiz data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatequiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!quiz) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz data not updated." })
        }

        return res.status(200).json({ sucess: true, data: quiz, Message: "quiz data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletquiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(400).json({ sucess: false, data: [], Message: "quiz data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: quiz, Message: "quiz data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    getquiz,
    getAllquiz,
    addquiz,
    updatequiz,
    deletquiz
}