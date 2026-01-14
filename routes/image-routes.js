const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const isAdminMiddleware = require('../middleware/admin-middleware')
const uploadMiddleware = require('../middleware/image-middleware')
const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller')
const isAdminMiddleWare = require('../middleware/admin-middleware')

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
router.delete('/delete/:id', authMiddleware, isAdminMiddleWare, deleteImageController)

module.exports = router