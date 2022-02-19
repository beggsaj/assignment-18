const mongoose = require('mongoose')
const Thought = require('./Thought')

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    thoughts: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'thoughts' }],
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'users' }],
})

UserSchema.virtual('friendCount').get(function(){
    return this.friends.length
})

UserSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('Users', UserSchema)