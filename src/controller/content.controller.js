const Content = require("../model/content.model");
const { uploadcloudinary, videoUploadcloudinary, videoDeletecloudinary, deletecloudinary } = require("../servicer/cloudinary");

const addcontent = async (req, res) => {
    try {
        console.log("filesssssssssss", req.file, req.file.path);

        const cloudinaryObj = await uploadcloudinary(req.file.path, 'Content')

        console.log("objjjjj", cloudinaryObj);

        const content = await Content.create({
            ...req.body,
            content_file: [{ public_id: cloudinaryObj.public_id, url: cloudinaryObj.url , type:cloudinaryObj.type}]
        })

        if (!content) {
            return res.status(400).json({ sucess: false, data: null, Message: "content not added" })
        }

        return res.status(200).json({ sucess: true, data: content, Message: "content data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getAllcontent = async (req, res) => {
    try {
        const content = await Content.find();

        if (!content) {
            return res.status(400).json({ sucess: false, data: [], Message: "All content data found." })
        }

        return res.status(200).json({ sucess: true, data: content, Message: "All content data." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const getcontent = async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return res.status(400).json({ sucess: false, data: [], Message: "content data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: content, Message: "content data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updatecontent = async (req, res) => {
    try {
        console.log("req bodyyyyyyyyyyy", req.body, req.file);
        
        const contentData = await Content.findById(req.params.id);

        let uData = { ...req.body, content_file: [{ public_id: contentData.content_file[0]?.public_id, url: contentData?.content_file[0].url , type:contentData.content_file[0]?.type}] }

        if (req.file) {
            console.log("filessssssssss", req.file);

            contentData?.content_file?.map(async (v) => await deletecloudinary(v?.public_id, v.type))

            const cloudinaryObj = await uploadcloudinary(req.file.path, 'Content')

            uData.content_file = [{ public_id: cloudinaryObj.public_id, url: cloudinaryObj.url , type:cloudinaryObj.type}]
        }

        console.log("udataa", uData);
        
        const content = await Content.findByIdAndUpdate(
            req.params.id,
            uData,
            { new: true, runValidators: true }
        )

        if (!content) {
            return res.status(400).json({ sucess: false, data: [], Message: "content data not updated." })
        }

        return res.status(200).json({ sucess: true, data: content, Message: "content data updated." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error.message })
    }
}

const deletcontent = async (req, res) => {
    try {
        const content = await Content.findByIdAndDelete(req.params.id);
        console.log("deletteeeeeeee", content);
        
        for(let file of content?.content_file){
            await deletecloudinary(file.public_id, file.type)
        }

        if (!content) {
            return res.status(400).json({ sucess: false, data: [], Message: "content data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: content, Message: "content data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    getcontent,
    getAllcontent,
    addcontent,
    updatecontent,
    deletcontent
}