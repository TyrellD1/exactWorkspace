const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const User = require('../models/users')

const groupchats = new Schema({
    name: {
        type: String,
        required: true,
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
})

groupchats.post('save', async function (groupchat) {
    try {
        if (groupchat.members.length) {
            console.log(groupchat)
            const members = await User.find({ _id : { $in : groupchat.members }} )
            for(member of members) {
                if(!member.groupchats.includes(`${groupchat._id}`)) {
                member.groupchats.push(groupchat) 
                member.save()
                }
            }
        }
    } catch(e) {
        console.log(e)
    }
})

groupchats.post('findOneAndDelete', async function (groupchat) {
    try {
        if (groupchat.members.length) {
            console.log(groupchat)
            const members = await User.find({ _id : { $in : groupchat.members }} )
            for(member of members) {
                member.groupchats.splice(member.groupchats.indexOf(groupchat), 1) 
                await member.save()
            }
        }
    } catch(e) {
        console.log(e)
    }
})

const Groupchat = mongoose.model('Groupchat', groupchats)

module.exports = Groupchat;