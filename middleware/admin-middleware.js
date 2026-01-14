
const isAdminMiddleWare = (req, res, next) => {
    if (req.userInfo.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'You are not allowed to visit the admin page'
        })
    }
    next()
}

module.exports = isAdminMiddleWare