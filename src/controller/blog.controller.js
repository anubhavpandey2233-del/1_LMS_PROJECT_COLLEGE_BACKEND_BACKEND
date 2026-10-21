const fs = require('fs');
const Coruse = require("../model/coruse.model");
const { uploadcloudinary, deletecloudinary } = require('../servicer/cloudinary');
const Blog = require('../model/blog.model');
const dayjs = require('dayjs');

const addBlog = async (req, res) => {
    try {
        const Files = req.files

        let uploadedImages = [];

        for (const content_file of Files) {

            const cloudinaryObj = await uploadcloudinary(content_file.path, 'blog')

            uploadedImages.push({
                public_id: cloudinaryObj.public_id,
                url: cloudinaryObj.url
            });
        }

        const blog = await Blog.create({ ...req.body, content_file: uploadedImages });

        if (!blog) {
            return res.status(400).json({ sucess: false, data: null, Message: "blog not added" })
        }

        return res.status(200).json({ sucess: true, data: blog, Message: "blog data Added sucessfully." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const getAllBlog = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const blog = await Blog.find().populate("instructor", "name email")

        if (!blog) {
            return res.status(400).json({ sucess: false, data: [], Message: "blog data not feached." })
        }

        return res.status(200).json({ sucess: true, data: blog, Message: "blog data feached." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }


}

const getBlog = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(400).json({ sucess: false, data: [], Message: "blog data not fetched." })
        }

        return res.status(200).json({ sucess: true, data: blog, Message: "blog data fetched." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }

}

const updateBlog = async (req, res) => {
    try {
        const blogdata = await Blog.findById(req.params.id);

        let uData = { ...req.body, content_file : blogdata.content_file }

         const Files = req.files
         console.log(Files);
         
        if (req.files?.length > 0) {
            
            let uploadedImages = [];

            blogdata.content_file.map((v) => deletecloudinary(v?.public_id))
            
            for (const content_file of Files) {
                
                const cloudinaryObj = await uploadcloudinary(content_file.path, 'blog')

                uploadedImages.push({
                    public_id: cloudinaryObj.public_id,
                    url: cloudinaryObj.url
                });
            }
            uData.content_file = uploadedImages
        }

        console.log("uData", uData);

        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            uData,
            { new: true, runValidators: true }
        )


        if (!blog) {
            return res.status(400).json({ sucess: false, data: [], Message: "Blog data not updated." })
        }

        return res.status(200).json({ sucess: true, data: blog, Message: "Blog data updated." })

    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

const deleteBlog = async (req, res) => {
    // #swagger.tags = ['course']
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);

        blog?.content_file.map(async (v) =>  await deletecloudinary(v?.public_id))
       

        if (!blog) {
            return res.status(400).json({ sucess: false, data: [], Message: "blog data not deleted." })
        }

        return res.status(200).json({ sucess: true, data: blog, Message: "blog data deleted." })
    } catch (error) {
        return res.status(500).json({ sucess: false, data: null, Message: "Internal Server Error :" + error })
    }
}

module.exports = {
    addBlog,
    getAllBlog,
    getBlog,
    updateBlog,
    deleteBlog,
}