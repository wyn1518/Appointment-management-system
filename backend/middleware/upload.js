
const multer = require("multer");

const path = require('path');

const upload = multer({
    limits:800000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            
            cb(null,"./backend/uploads/image")
        },
        filename : (req,file,cb)=>{
            // naming file name 
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            req.body.path = uniqueSuffix + path.extname(file.originalname);
            cb(null,  uniqueSuffix + path.extname(file.originalname))
        }
    }),
    fileFilter : fileFilter = (req,file,cb) => {
        const allowedFileType = ["jpg", "jpeg", "png"];
        if(allowedFileType.includes(file.mimetype.split("/")[1])){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }
}).single('image');

module.exports = upload;