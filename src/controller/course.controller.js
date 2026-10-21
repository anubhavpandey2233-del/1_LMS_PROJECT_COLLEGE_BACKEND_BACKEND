const fs = require('fs');
const Coruse = require("../model/coruse.model");
const { uploadcloudinary, deletecloudinary } = require('../servicer/cloudinary');

const addCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        // console.log("cat data", req.body);
        // console.log("filesss", req.files);

        const Files = req.files

        let uploadedImages = [];

        for (const course_img of Files) {

            const cloudinaryObj = await uploadcloudinary(course_img.path, 'Course')

            uploadedImages.push({
                public_id: cloudinaryObj.public_id,
                url: cloudinaryObj.url
            });
        }


        const coruse = await Coruse.create({ ...req.body, course_img: uploadedImages });

        if (!coruse) {
            return res.status(400).json({ sucess: false, data: null, Message: "Couser not added" })
        }

        return res.status(200).json({ sucess: true, data: coruse, Message: "Couser data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const getAllCouser = async (req, res) => {
    try {
        const coruse = await Coruse.find();

        return res.status(200).json({
            sucess: true,
            data: coruse,
            Message: "Couser data feached."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            sucess: false,
            data: null,
            Message: error.message
        });
    }
};

const getCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const coruse = await Coruse.findById(req.params.id);

        if (!coruse) {
            return res.status(400).json({ sucess: false, data: [], Message: "Couser data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: coruse, Message: "Couser data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updateCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const courseData = await Coruse.findById(req.params.id);

        console.log("All course", courseData);

        let uData = { ...req.body, course_img : courseData.course_img }


         const Files = req.files
         console.log(Files);
         
        if (req.files?.length > 0) {
            // fs.unlink(courseData.course_img, (error) => {
            //     console.log(error);
            // })

            // uData.course_img = req.file.path
            
            let uploadedImages = [];

            courseData.course_img.map((v) => deletecloudinary(v?.public_id))
            
            for (const course_img of Files) {
                
                const cloudinaryObj = await uploadcloudinary(course_img.path, 'Course')

                uploadedImages.push({
                    public_id: cloudinaryObj.public_id,
                    url: cloudinaryObj.url
                });
            }


            // const cloudinaryObj = await uploadcloudinary(req.file.path, 'Course')

            uData.course_img = uploadedImages
        }

        console.log("uData", uData);

        const coruse = await Coruse.findByIdAndUpdate(
            req.params.id,
            uData,
            { new: true, runValidators: true }
        )


        if (!coruse) {
            return res.status(400).json({ sucess: false, data: [], Message: "Couser data not updated." })
        }

        return res.status(200).json({ sucess: true, data: coruse, Message: "Couser data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const deletCouser = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const coruse = await Coruse.findByIdAndDelete(req.params.id);

        // fs.unlink(coruse.course_img, (error) => {
        //     console.log(error);

        // })
        coruse?.course_img.map(async (v) =>  await deletecloudinary(v?.public_id))
       

        if (!coruse) {
            return res.status(400).json({ sucess: false, data: [], Message: "Couser data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: coruse, Message: "Couser data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const updateCouserStauts = async (req, res) => {
    // #swagger.tags = ['course']
    try {

        let uData = { ...req.body }

        const courseData = await Coruse.findById(req.params.id);

        console.log(uData);

        const coruse = await Coruse.findByIdAndUpdate(
            req.params.id,
            uData,
            { new: true, runValidators: true }
        )


        if (!coruse) {
            return res.status(400).json({ sucess: false, data: [], Message: "Couser stauts not updated." })
        }

        return res.status(200).json({ sucess: true, data: coruse, Message: "Couser stauts updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addCouser,
    getAllCouser,
    getCouser,
    updateCouser,
    deletCouser,
    updateCouserStauts
}