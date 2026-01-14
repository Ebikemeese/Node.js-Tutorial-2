const Image = require('../models/image')
const {uploadToCloudinary} = require('../helpers/cloudinary-helper')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res) => {
    try {
        //check if file is not in the req
        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'File is missing'
            })
        }
        //upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path)

        //store userId, image url and publicId to mongodb
        const uploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await uploadedImage.save()

        //delete file from local storage
        fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: uploadedImage
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again'
        })
    }
}

//fetch all images controller
const fetchImagesController = async(req, res) => {
    try {
        const images = await Image.find({})

        if (images) {
            res.status(200).json({
                success: true,
                data: images
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again'
        })
    }
}

//delete image controller
const deleteImageController = async (req, res) => {
    try {
        const getCurrentIdOfImage = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImage)

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            })
        }

        //check if image is uploaded by user
        if (image.uploadedBy.toString() !== userId) {
            res.status(403).json({
                success: false,
                message: 'You are not the owner of this image'
            })
        }

        //delete the image from cloudinary
        await cloudinary.uploader.destroy(image.publicId)

        //delete image from mongodb database
        await Image.findByIdAndDelete(getCurrentIdOfImage)

        res.status(200).json({
            success: true,
            message: 'Image deleted successfully'
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again'
        })
    }
}

module.exports = {
    uploadImageController,
    fetchImagesController,
    deleteImageController
}