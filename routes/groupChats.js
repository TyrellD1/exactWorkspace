const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')

const Groupchat = require('../models/groupChats')
const Message = require('../models/messages')
const User = require('../models/users');

const { isLoggedIn } = require('../functions/middleware');

// Group Chat Page
router.get('/groupchat/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const groupchat = await Groupchat.findById(id).populate('members').populate({ path: 'messages', populate: { path: 'from' }}).populate('admin')
    res.render('groupchats/groupchat', { groupchat })
}))
//

// Posts, Puts, Deletes

// Create groupChat
router.post('/createGroupChat', isLoggedIn, catchAsync(async(req, res) => {
    const currentUser = req.user
    const { name, members } = req.body
    const members1 = await User.find({ _id: { $in: members }})
    const groupchat = new Groupchat({ name: name, admin: currentUser, members: members1})
    await groupchat.members.push(currentUser)
    await groupchat.save()
    res.redirect('/e')
}))
//

// Send groupchat Message
router.post('/sendGcMessage/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const { message } = req.body;
    const groupchat = await Groupchat.findById(id);
    const newMessage = new Message({message: message, from: currentUser})
    groupchat.messages.unshift(newMessage)
    await newMessage.save()
    await groupchat.save()
    res.redirect('back')
}))
//

// Update groupchat admin
router.put('/makeAdmin/:userId/:groupchatId', isLoggedIn, catchAsync(async(req, res) => {
    const { userId, groupchatId } = req.params;
    const currentUser = req.user;
    const newAdmin = await User.findById(userId);
    const groupchat = await Groupchat.findById(groupchatId);
    groupchat.admin = newAdmin
    await groupchat.save()
    res.redirect('back')
}))
//

// Admin Remove Other Users from Groupchat
router.put('/removeUser/:userId/:groupchatId', isLoggedIn, catchAsync(async(req, res) => {
    const { userId, groupchatId } = req.params;
    const groupchat = await Groupchat.findById(groupchatId);
    const removeUser = await User.findById(userId);
    removeUser.groupchats.splice(removeUser.groupchats.indexOf(groupchat._id), 1);
    groupchat.members.splice(groupchat.members.indexOf(removeUser._id), 1)
    await removeUser.save()
    await groupchat.save()
    res.redirect('back')
}))
//

// Leave Groupchat
router.put('/leaveGroupchat/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const groupchat = await Groupchat.findById(id).populate('admin');
    currentUser.groupchats.splice(currentUser.groupchats.indexOf(groupchat._id), 1);
    if(groupchat.admin.username !== currentUser.username) {
        if(groupchat.members.length > 1) {
            groupchat.members.splice(groupchat.members.indexOf(currentUser._id), 1)
            await currentUser.save();
            await groupchat.save();
            res.redirect('/e')
        } else if(groupchat.members.length <= 1) {
            const deletedGroupchat = await Groupchat.findByIdAndDelete(groupchat._id)
            res.redirect('/e')
        }
    } else if(groupchat.admin.username === currentUser.username) {
        if(groupchat.members.length > 1) {
            const users = groupchat.members
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const newAdmin = await User.findById(randomUser._id);
            groupchat.members.splice(groupchat.members.indexOf(currentUser._id), 1)
            await currentUser.save();
            groupchat.admin = newAdmin;
            await groupchat.save();
            res.redirect('/e')
        } else if(groupchat.members.length <= 1) {
            const deletedGroupchat = await Groupchat.findByIdAndDelete(groupchat._id)
            res.redirect('/e')
        }
    }
}))
//

module.exports = router;
