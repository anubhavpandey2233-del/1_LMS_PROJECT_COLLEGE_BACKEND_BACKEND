const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("file", file);

        const filePath = path.join("public", "Images", file.fieldname);

        console.log(filePath);

        fs.mkdir(filePath, (error) => {
            console.log("error for upload.js",error);

        })

        cb(null, filePath)
        // cb(null, "/tmp")
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();

        // if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.svg') {
        //     throw new Error("Please upload .png, .jpg, .jpeg, or .svg file ")
        // }

        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
})

const upload = multer({ storage: storage })

module.exports = upload