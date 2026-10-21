const Enroll = require("../model/enrollment.model");
const secrionsModel = require("../model/section.model");

const getEnroll = async (req, res) => {
    try {
        const enroll = await Enroll.findById(req.params.id);

        res
            .status(200)
            .json({ sucess: true, data: enroll, message: "get sucessfully" });
    } catch (error) {
        res
            .status(500)
            .json({
                data: null,
                message: "Internal Server Error: " + error.meassage,
            });
    }
};

const getAllEnroll = async (req, res) => {
    console.log("terms Routes");
    try {
        const enroll = await Enroll.find();

        res
            .status(200)
            .json({ sucess: true, data: enroll, message: "get sucessfully" });
    } catch (error) {
        res
            .status(500)
            .json({
                data: null,
                message: "Internal Server Error: " + error.meassage,
            });
    }
};

const addEnroll = async (req, res) => {
    try {
        const enroll = await Enroll.create(req.body);

        res.status(200).json({
            success: true,
            message: "enroll added successfully",
            data: enroll,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                data: null,
                message: "Internal Server Error: " + error.meassage,
            });
    }
};

const updateEnroll = async (req, res) => {
    try {


        const enrollData = await Enroll.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!enrollData) {
            return res
                .status(404)
                .json({ data: null, message: "enroll not updated" });
        }

        res.status(200).json({
            success: true,
            message: "enroll update successfully",
            data: enrollData,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                data: null,
                message: "Internal Server Error: " + error.meassage,
            });
    }
};

const deleteEnroll = async (req, res) => {
    try {

        const enroll = await Enroll.findByIdAndDelete(req.params.id);

        if (!enroll) {
            return res
                .status(404)
                .json({ data: null, message: "enroll not deleted" });
        }
        res.status(200).json({
            success: true,
            message: "enroll delete successfully",
            data: null,
        });
    } catch (error) {
        res
            .status(500)
            .json({
                data: null,
                message: "Internal Server Error: " + error.meassage,
            });
    }
};

module.exports = {
    getEnroll,
    getAllEnroll,
    addEnroll,
    updateEnroll,
    deleteEnroll,
};
