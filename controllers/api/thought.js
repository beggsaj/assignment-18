const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Thought = require('../../models/Thought')
const User = require('../../models/User')

router.get('/', async (req, res) => {
    try {
        const testThoughts = await Thought.find()
        res.json(testThoughts)
    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', async (req, res) => {
    try {
        //console.log(`Get thought by id ${req.params.id}`)
        const thought = await Thought.findOne({ _id: req.params.id })
        //console.log(thought.reactionCount)
        res.json(thought)
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', async (req, res) => {
    try {
        //console.log(`Get thought by id ${req.params.id}`)
        const thought = await Thought.findOne({ _id: req.params.id })
        console.log(thought.thoughtText)
        thought.thoughtText = req.body.thoughtText
        await thought.save()
        res.json(thought)
    } catch (error) {
        console.log(error)
        res.status(404).send(error)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.id })
        console.log(thought.username)
        const user = await User.findOne({ username: [thought.username] })
        if (user) {
            console.log(user)
            await User.updateOne({ _id: user._id },
                { $pullAll: { thoughts: [thought.id] } })
        }
        await Thought.deleteOne({ _id: req.params.id })
        res.json({ message: 'Thoght deleted.' })
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {
        await Thought.create(req.body).then(function (record) {
            User.findOne({ _id: req.body.userId }).then(function (user) {
                user.thoughts.push(record._id)
                user.save()
            })
        })
        res.json(req.body)
    } catch (error) {
        console.log(error)
    }
})

router.post('/:id/reactions', async (req, res) => {
    try {
        //console.log(`Post to thought by id ${req.params.id}`)
        //console.log(`reactionBody ${req.body.reactionBody}`)
        const thought = await Thought.findOne({ _id: req.params.id }).then(function (record) {
            record.reactions.push({
                reactionId: mongoose.Types.ObjectId(),
                reactionBody: req.body.reactionBody,
                username: req.body.username
            })
            console.log(record)
            record.save()
            return record
        })
        res.json(thought)
    } catch (error) {
        console.log(error)
    }
})

// Delete reaction

router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        const thought = await Thought.findOne({ _id: req.params.thoughtId })
        if (thought) {
            //console.log(`reactionId: ${req.params.reactionId}`)
            const reactionId = mongoose.Types.ObjectId(req.params.reactionId)
            const reaction = thought.reactions.find(function (reaction) {
                //console.log(reaction)
                //console.log(reactionId)
                if (reaction.reactionId.equals(reactionId)) {
                    //console.log('found')
                    return reaction
                }
            })

            if (reaction) {
                reaction.remove()
            } else {
                res.status(404).send('Not found')
            }
            
            thought.save()
        }
        res.json(thought)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

module.exports = router