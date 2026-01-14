const multer = require('multer')
const path = require('path')

//set multer storage
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'nodejs-image-uploads/')
    },
    filename: function(req, file, cb){
        cb(null,

            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

//file filter
const checkFileFilter =  (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true)
    } else {
        cb(new Error('File is not an image, please upload an image file.'))
    }
}

//multer middleware

module.exports = multer({
    storage: storage,
    fileFilter: checkFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024//5MB
    }

})