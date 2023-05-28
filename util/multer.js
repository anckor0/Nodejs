const multer = require('multer');

const storage = multer.diskStorage({
    destinantion: (error, file, req) => {
        cb(null, '../images')
    },
    filename: (error, file, req) => {
        cb(null, 'abcd' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'image/jpg' || file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
      cb(null, true)
    }
    cb(null, false)
}

const upload = multer({storage: storage, fileFilter: fileFilter}).single('newImage')

module.exports = upload