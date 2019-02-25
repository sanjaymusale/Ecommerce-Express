const express = require('express')

const router = express()

const { Category } = require('../models/category')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')



router.get('/', authenticate, authorization, (req, res) => {
    Category.find()
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.post('/', authenticate, authorization, (req, res) => {
    const data = req.body
    const category = new Category(data)
    category.save()
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.send('data not inserted')
        })
})

router.get('/:id', authenticate, authorization, (req, res) => {
    const _id = req.params.id
    Category.findOne({ _id })
        .then((category) => {
            res.send(category)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put('/:id', authenticate, authorization, (req, res) => {
    const _id = req.params.id
    const body = req.body
    Category.findOneAndUpdate({ _id }, { $set: body })
        .then((category) => {
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
    Category.findOneAndRemove({ _id })
        .then((category) => {
            res.send({
                notice: 'Deleted Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})

module.exports = {
    categoryRouter: router
}
