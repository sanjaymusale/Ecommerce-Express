const express = require('express')
const router = express()
const fs = require('fs')
const link = 'http://localhost/'
const { Product } = require('../models/product')
const { authenticate } = require('../middlewares/authenticate')
const { authorization } = require('../middlewares/authorization')
const { upload } = require('../middlewares/fileUpload')

router.get('/', authenticate, (req, res) => {


    Product.find()
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})
router.post('/', upload.single('myImage'), (req, res) => {
    const body = req.body

    const imageUrl = req.file.destination
    body.imageUrl = imageUrl.slice(1) + req.file.filename
    const product = new Product(body)
    product.save()
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})


router.get('/:id', authenticate, (req, res) => {
    const _id = req.params.id
    Product.findOne({ _id })
        .then((product) => {
            res.send(product)
        })
        .catch((err) => {
            res.send(err)
        })
})

router.put('/:id', authenticate, authorization, (req, res) => {
    const _id = req.params.id
    const body = req.body
    Product.findOneAndUpdate({ _id }, { $set: body })
        .then((product) => {
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
    Product.findOneAndRemove({ _id })
        .then((product) => {
            res.send({
                notice: 'Deleted Succesfully'
            })
        })
        .catch((err) => {
            res.send(err)
        })
})




module.exports = {
    productRouter: router
}