const Categories = require("../model/categories.model");
const { uploadcloudinary, deletecloudinary } = require("../servicer/cloudinary");

const addcategories = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                sucess: false,
                data: null,
                Message: "Please select a category image."
            });
        }

        const { name, desciption, parent_id } = req.body;

        if (!name || !desciption) {
            return res.status(400).json({
                sucess: false,
                data: null,
                Message: "Name and description are required."
            });
        }

        const cloudinaryObj = await uploadcloudinary(
            req.file.path,
            "Categroy"
        );

        const category = await Categories.create({
            name,
            desciption,
            parent_id: parent_id || null,
            category_img: [{
                public_id: cloudinaryObj.public_id,
                url: cloudinaryObj.secure_url || cloudinaryObj.url
            }]
        });

        return res.status(201).json({
            sucess: true,
            data: category,
            Message: "Category data added successfully."
        });
    } catch (error) {
        console.error("Add Category Error:", error);

        return res.status(500).json({
            sucess: false,
            data: null,
            Message: "Internal Server Error: " + error.message
        });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Categories.find().sort({ createdAt: -1 });

        return res.status(200).json({
            sucess: true,
            data: categories,
            Message: "All Category data fetched successfully."
        });
    } catch (error) {
        console.error("Get All Categories Error:", error);

        return res.status(500).json({
            sucess: false,
            data: [],
            Message: "Internal Server Error: " + error.message
        });
    }
};

const getcategories = async (req, res) => {
    try {
        const category = await Categories.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Category not found."
            });
        }

        return res.status(200).json({
            sucess: true,
            data: category,
            Message: "Category fetched successfully."
        });
    } catch (error) {
        console.error("Get Category Error:", error);

        return res.status(500).json({
            sucess: false,
            data: null,
            Message: "Internal Server Error: " + error.message
        });
    }
};

const updatecategories = async (req, res) => {
    try {
        const categoryData = await Categories.findById(req.params.id);

        if (!categoryData) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Category not found."
            });
        }

        const { name, desciption, parent_id } = req.body;

        const updateData = {
            ...(name !== undefined && { name }),
            ...(desciption !== undefined && { desciption }),
            ...(parent_id !== undefined && { parent_id: parent_id || null })
        };

        if (req.file) {
            const cloudinaryObj = await uploadcloudinary(
                req.file.path,
                "Categroy"
            );

            updateData.category_img = [{
                public_id: cloudinaryObj.public_id,
                url: cloudinaryObj.secure_url || cloudinaryObj.url
            }];
        }

        const updatedCategory = await Categories.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (req.file && updatedCategory) {
            for (const image of categoryData.category_img || []) {
                if (image.public_id) {
                    try {
                        await deletecloudinary(image.public_id);
                    } catch (error) {
                        console.error("Old image deletion error:", error.message);
                    }
                }
            }
        }

        return res.status(200).json({
            sucess: true,
            data: updatedCategory,
            Message: "Category updated successfully."
        });
    } catch (error) {
        console.error("Update Category Error:", error);

        return res.status(500).json({
            sucess: false,
            data: null,
            Message: "Internal Server Error: " + error.message
        });
    }
};

const deletcategories = async (req, res) => {
    try {
        const category = await Categories.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                sucess: false,
                data: null,
                Message: "Category not found."
            });
        }

        for (const image of category.category_img || []) {
            if (image.public_id) {
                try {
                    await deletecloudinary(image.public_id);
                } catch (error) {
                    console.error("Cloudinary image deletion error:", error.message);
                }
            }
        }

        return res.status(200).json({
            sucess: true,
            data: category,
            Message: "Category deleted successfully."
        });
    } catch (error) {
        console.error("Delete Category Error:", error);

        return res.status(500).json({
            sucess: false,
            data: null,
            Message: "Internal Server Error: " + error.message
        });
    }
};

module.exports = {
    addcategories,
    getAllCategories,
    getcategories,
    updatecategories,
    deletcategories
};
