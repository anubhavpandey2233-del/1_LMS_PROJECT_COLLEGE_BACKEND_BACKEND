const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadcloudinary = async (file, folder) => {
    try {
        const uploadResult = await cloudinary.uploader
            .upload(
                file, {
                folder: folder,
                resource_type:'auto'
            })
            .catch((error) => {
                console.log("error for cloudnary", error);
            });
        console.log(uploadResult);

        return {
            public_id: uploadResult.public_id,
            url: uploadResult.url,
            type : uploadResult.resource_type,
        }
    } catch (error) {
        console.log(error);

    }
}

const deletecloudinary = async (public_id, type) => {
    try {
        const result = await cloudinary.uploader
            .destroy(public_id,{resource_type:type}) 
            .then(result => console.log(result));
    }
    catch (error) {

    }

}

module.exports = {
    uploadcloudinary,
    deletecloudinary
}