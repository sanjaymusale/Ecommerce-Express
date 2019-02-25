const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Schema } = mongoose
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        minlength: 5
    },
    lastname: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'Invalid Email'
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 123
    },
    role: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String
            }
        }
    ]

})

userSchema.pre('validate', function (next) {

    let count
    if (this.isNew) {
        this.constructor.countDocuments((err, data) => {
            if (err) {
                return next(err)
            }
            count = data
            console.log('count of document =>', count)

        })
            .then(() => {
                if (count == 0) {
                    this.role = 'admin'
                    next()
                }
                else {
                    this.role = 'user'
                    next()
                }

            })
    }
    else {
        next()
    }
})



userSchema.pre('save', function (next) {

    if (this.isNew) {
        bcryptjs.genSalt(10).then((salt) => {
            bcryptjs.hash(this.password, salt).then((hashed) => {
                this.password = hashed
                next()
            })
        })
    }
    else {
        next()
    }


})

userSchema.statics.findByEmailAndPassword = function (email, password) {
    const User = this
    console.log('entering find email')
    return User.findOne({ email })
        .then((user) => {
            console.log('entering find email if')
            if (user) {
                return bcryptjs.compare(password, user.password)
                    .then((result) => {
                        console.log('inside bcrypt then')
                        if (result) {
                            console.log('entering if result', result)
                            return Promise.resolve(user)
                        }
                        else {
                            console.log('entering else result', result)
                            const err = 'invalid password'
                            return Promise.reject(err)
                        }
                    })
            }
            else {
                return Promise.reject('invalid Email and password')
            }
        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

userSchema.methods.generateToken = function () {
    const user = this
    const data = {
        userid: user._id,
        role: user.role
    }
    const token = jwt.sign(data, 'sanjay@123')
    user.tokens.push({ token })
    return user.save()
        .then((user) => {
            console.log(token)
            return Promise.resolve(token)
        })
        .catch((err) => {
            return (err)
        })

}

userSchema.statics.findByToken = function (token) {
    const User = this
    let tokenData
    try {
        tokenData = jwt.verify(token, 'sanjay@123')
        console.log(tokenData)
    }
    catch (err) {
        return Promise.reject(err)
    }

    return User.findOne({
        '_id': tokenData.userid,
        'tokens.token': token
    })
        .then((user) => {
            return Promise.resolve(user)
        })
        .catch((err) => {
            return Promise.reject(err)
        })


}
const User = mongoose.model('User', userSchema)

module.exports = {
    User
}