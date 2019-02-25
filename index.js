const express = require('express')

const mongoose = require('./config/database')
const { usersRouter } = require('./app/controllers/user_controller')
const { productRouter } = require('./app/controllers/product_controller')
const { categoryRouter } = require('./app/controllers/category_controller')


const app = express()
const port = 3001
app.use(express.json())
app.use(express.static('./public'));

app.use('/users', usersRouter)
app.use('/products', productRouter)
app.use('/categories', categoryRouter)


app.get('/', (req, res) => {
    res.send('welcome')
})

app.listen(port, () => {
    console.log('Listening to port 3001')
})