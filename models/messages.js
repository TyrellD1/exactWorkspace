const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const messages = new Schema({
    message: {
        type: String,
        required: true,
    },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const Message = mongoose.model('Message', messages)

module.exports = Message;