const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const isAdminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/image-middleware')
const { uploadImageController, fetchImagesController } = require('../controllers/image-controller')

const router = express.Router()

//upload the image
router.post(
    '/upload', 
    authMiddleware, 
    isAdminMiddleware, 
    uploadMiddleware.single('image'), 
    uploadImageController
)

//get all the image
router.get('/get', authMiddleware, fetchImagesController)

module.exports = router