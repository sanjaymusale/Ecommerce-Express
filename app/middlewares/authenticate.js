const { User } = require('../models/user')

function authenticate(req, res, next) {
    const token = req.header('x-auth')
    if (token) {
        // console.log('token', token)
        User.findByToken(token)
            .then((user) => {
                // console.log('inside authenticate then =>', user)
                req.user = user
                next()
            })
            .catch((err) => {
                console.log('inside error')
                res.send(err)
            })
    }
    else {
        res.send('token not provided')
    }
}
module.exports = {
    authenticate
}