const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')

const Groupchat = require('../models/groupChats')
const Message = require('../models/messages')
const User = require('../models/users');
const Conversation = require('../models/conversations');

const { isLoggedIn } = require('../functions/middleware');

// User Conversation Page
router.get('/conversation/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const conversation = await Conversation.findById(id).populate('messages')
    const users = await User.find({})
    res.render('conversations/conversation', { users, conversation })
}))
//

// Posts, Puts, Deletes

// Leaves Conversation
router.put('/leaveConversation/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const conversation = await Conversation.findById(id).populate({ path: 'user1', populate: { path: 'user' }}).populate({ path: 'user2', populate: { path: 'user' }});
    currentUser.conversations.splice(currentUser.conversations.indexOf(conversation._id), 1);
    currentUser.save()
    if(currentUser.username === conversation.user1.user.username) {
        conversation.user1.active = false
        conversation.save()
        if(conversation.user2.active === false) {
            const deletedConversation = await Conversation.findByIdAndDelete(id);
            res.redirect('/e')
        } else {
            res.redirect('/e')
        }
    } else if(currentUser.username === conversation.user2.user.username) {
        conversation.user2.active = false
        conversation.save()
        if(conversation.user1.active === false) {
            const deletedConversation = await Conversation.findByIdAndDelete(id);
            res.redirect('/e')
        } else {
            res.redirect('/e')
        }
    } else {
        res.redirect('/e')
    }
}))
//

module.exports = router;