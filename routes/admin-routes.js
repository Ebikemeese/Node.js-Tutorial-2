const express = require('express')
const authMiddleware = require('../middleware/auth-middleware')
const isAdminMiddleWare = require('../middleware/admin-middleware')

const router = express.Router()

router.get('/welcome', authMiddleware, isAdminMiddleWare, (req, res) => {
    res.json({
        message: 'Welcome to the admin page'
    })
})

module.exports = router