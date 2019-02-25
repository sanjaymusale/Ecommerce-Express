const mongoose = require('mongoose')
const { Schema } = require('mongoose')
const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 125,
        unique: true

    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 125
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        required: true,
        minimum: 1

    },
    stock: {
        type: Number,
        required: true,
        minimum: 0,
    },

    codEligible: {
        type: Boolean,
        required: true

    },
    imageUrl: {
        type: String
    }

})
const Product = mongoose.model('Product', productSchema)

module.exports = {
    Product
}