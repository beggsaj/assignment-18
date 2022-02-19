const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Thought = require('../../models/Thought')
const User = require('../../models/User')

module.exports = router