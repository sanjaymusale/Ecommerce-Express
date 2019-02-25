

function authorization(req, res, next) {
    const user = req.user
    // console.log(user)
    if (user.role == 'admin') {
        next()
    } else {
        // console.log('autjhorize')
        res.status(404).send('you are not authorized to access this url')
    }
}

module.exports = {
    authorization
}