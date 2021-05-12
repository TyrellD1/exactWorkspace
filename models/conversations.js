const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversations = new Schema({
    user1: { 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    user2: {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
        active: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], 
})

const Conversation = mongoose.model('Conversation', conversations)

module.exports = Conversation;