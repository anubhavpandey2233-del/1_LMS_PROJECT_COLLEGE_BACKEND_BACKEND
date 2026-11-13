const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadcloudinary = async (file, folder, resourceType = "auto") => {
    try {
        const uploadResult = await cloudinary.uploader.upload(file, {
            folder: folder,
            resource_type: resourceType
        });

        console.log("Cloudinary Upload Result:", uploadResult);

        return {
            public_id: uploadResult.public_id,
            url: uploadResult.secure_url || uploadResult.url,
            type: uploadResult.resource_type,
        };
    } catch (error) {
        console.log("Cloudinary Upload Error:", error);
        throw error;
    }
};

const deletecloudinary = async (public_id, type = "image") => {
    try {
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: type
        });

        console.log("Cloudinary Delete Result:", result);
        return result;
    } catch (error) {
        console.log("Cloudinary Delete Error:", error);
        throw error;
    }
};

module.exports = {
    uploadcloudinary,
    deletecloudinary
};


// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadcloudinary = async (file, folder) => {
//     try {
//         const uploadResult = await cloudinary.uploader
//             .upload(
//                 file, {
//                 folder: folder,
//                 resource_type:'auto'
//             })
//             .catch((error) => {
//                 console.log("error for cloudnary", error);
//             });
//         console.log(uploadResult);

//         return {
//             public_id: uploadResult.public_id,
//             url: uploadResult.url,
//             type : uploadResult.resource_type,
//         }
//     } catch (error) {
//         console.log(error);

//     }
// }


// const deletecloudinary = async (public_id, type = "image") => {
//     try {
//         const result = await cloudinary.uploader.destroy(public_id, {
//             resource_type: type
//         });

//         console.log("Cloudinary Delete Result:", result);
//         return result;
//     } catch (error) {
//         console.log("Cloudinary Delete Error:", error);
//         throw error;
//     }
// };


// module.exports = {
//     uploadcloudinary,
//     deletecloudinary
// }