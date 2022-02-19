const mongoose = require('mongoose')
const moment = require('moment')

function dateGetter(date) {
    return moment(date).format("YYYY-DD-MM h:mm:ss a")
}

const ReactionSchema = new mongoose.Schema({
    reactionId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    reactionBody: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        get: dateGetter
    }
})

ReactionSchema.set('toJSON', { getters: true });

const ThoughtSchema = new mongoose.Schema({
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        get: dateGetter
    },
    reactions: [ReactionSchema]
})

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length
})

ThoughtSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Thoughts', ThoughtSchema)