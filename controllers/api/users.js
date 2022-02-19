const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const User = require('../../models/User')

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        user.delete()
        res.json({ "response": "User deleted."})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        console.log(` username DB ${user.username}`)
        console.log(` username body ${req.body.username}`)
        if (user.username !== req.body.username)
        {
            const userExsist = await User.findOne({ username: req.body.username })
            if (userExsist)
            {
                res.status(400).send('Duplicate username found.')
            }
            user.username = req.body.username
        }
        if (user.email !== req.body.email)
        {
            const userExsist = await User.findOne({ email: req.body.email })
            if (userExsist)
            {
                res.status(400).send('Duplicate email found.')
            }
            user.email = req.body.email
        }
        user.save()
        res.json({ "response": "User saved."})
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/', async (req, res) => {
    try {
        await User.create(req.body)
        res.json(req.body)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
        const friend = await User.findOne({ _id: req.params.friendId })
        user.friends.push(friend._id)
        await user.save()
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        const user = await User.updateOne({ _id: req.params.userId },
           { $pullAll: { friends: [req.params.friendId] } })
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})

module.exports = router