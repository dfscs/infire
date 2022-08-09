const multer = require("multer");
const path = require("path");
const { v1: uuid } = require("uuid");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
};

module.exports = multer({ 
   
    limits: 500000,   // 5mb
    storage: multer.diskStorage({       //format check krta hai
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid() + "." + ext);    //uuid unique id generate krta hai aur ext sath me png,jpg ya jpeg kuch b ho skta
        },
    }),
    fileFilter: (req, file, cb) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error("Invalid image extension!");
        cb(error, isValid);
    },
});