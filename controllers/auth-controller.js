const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Register Controller
const registerUser = async (req, res) => {
    try {
        //extract user information
        const {username, email, password} = req.body

        //check if the user is already existing
        const checkExistingUser = await User.findOne({$or: [{username}, {email}]})
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this username or email already exist'
            })
        } else {
            //hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            //create user
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            })

            await newUser.save()

            if (newUser) {
                res.status(201).json({
                    data: newUser,
                    success: true,
                    message: 'User registered successfully'
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Unable to register user, please try again'
                })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.'
        })
    }
}

//Login Controller
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email && !password) {
            return res.status(400).json({
                success: false,
                message: 'Provide your login credentials'
            })
        }

        //check if user exists
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User with this email does not exist'
            })
        } 

        //check if the sent password is correct with the user's db password
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            })
        } else {
            //create user token
            const accessToken = jwt.sign({
                userId: user._id,
                username: user.username,
                role: user.role
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '15m'
            })

            res.status(200).json({
                data: accessToken,
                success: true,
                message: 'Login successful.'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.'
        })
    }
}

//change password
const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId

        //extract old and new password
        const {oldPassword, newPassword} = req.body

        //find the logged in user
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user not found'
            })
        }

        //check if the oldPassword is correct
        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Password does not match'
            })
        }

        //hash newPassword
        const salt = await bcrypt.genSalt(10)
        const newHashedPassword = await bcrypt.hash(newPassword, salt)

        //update user password
        user.password = newHashedPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: 'Password changes successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Something went wrong, please try again.'
        })
    }
}

module.exports = {registerUser, loginUser, changePassword}