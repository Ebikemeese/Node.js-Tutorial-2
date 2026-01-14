const Image = require('../models/image')
const {uploadToCloudinary} = require('../helpers/cloudinary-helper')
const fs = require('fs')

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

module.exports = {
    uploadImageController,
    fetchImagesController
}