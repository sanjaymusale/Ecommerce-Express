const express = require('express')
const router = express()
const { User } = require('../models/user')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')


router.get('/', authenticate, authorization, (req, res) => {
    User.find()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            res.send(err)
        })

})
router.post('/register', (req, res) => {
    const body = req.body
    const user = new User(body)
    user.save()
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/login', (req, res) => {
    const body = req.body
    User.findByEmailAndPassword(body.email, body.password)
        .then((user) => {
            return user.generateToken()

        })
        .then((token) => {
            // res.header('x-auth', token).send()
            res.send(token)
        })
        .catch((err) => {
            console.log('catch contorer', err)
            res.send(err)
        })
})

router.get('/:id', authenticate, (req, res) => {
    const _id = req.params.id
    User.findOne({ _id })
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put('/:id', authenticate, (req, res) => {
    const _id = req.params.id
    const body = req.body
    User.findOneAndUpdate({ _id }, { $set: body })
        .then((user) => {
            res.send({
                notice: 'updated Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

router.delete('/:id', authenticate, authorization, (req, res) => {
    const _id = req.params.id
    User.findOneAndRemove({ _id })
        .then((user) => {
            res.send({
                notice: 'Deleted Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})




module.exports = {
    usersRouter: router
}