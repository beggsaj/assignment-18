const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env'})

connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/api', require('./controllers/api/'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server running on port ${PORT}`))