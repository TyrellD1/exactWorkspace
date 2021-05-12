const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const users = new Schema({
    first: {
        type: String,
        required: true,
    },
    last: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    groupchats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groupchat' }]
})

users.plugin(passportLocalMongoose)

const User = mongoose.model('User', users)

module.exports = User;