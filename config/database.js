const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to db')
    })
    .catch((err) => {
        console.log('Error connection to DB', err)
    })

module.exports = {
    mongoose
}