const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')

const User = require('../models/users')
const Message = require('../models/messages')

const { isLoggedIn } = require('../functions/middleware');
const Conversation = require('../models/conversations');

// Home page
router.get('/e', catchAsync(async(req, res) => {
    const users = await User.find({})
    res.render('home', { users})
}))
//

// Login Page
router.get('/login', (req, res) => {
    res.render('users/login')
})
//

// Register User

router.get('/registerUser', (req, res) => {
    res.render('users/registerUser')
})
//

// Posts, Puts, Deletes

// Register User Post
router.post('/newUser', catchAsync(async (req, res, next) => {
    const { first, last, username, password } = req.body;
    const user = new User({ first, last, username });
    const newUser = await User.register(user, password)
    req.login(newUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Exact');
        res.redirect('/e');
    })
}))
//

// Logout
router.post('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'goodbye!')
    res.redirect('back')
})
//

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    try {
        req.flash('success', 'welcome back')
        res.redirect('/e')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('login')
    }
})
//

// Add Friend
router.post('/addFriend/:id', isLoggedIn, catchAsync(async(req, res) => {
    const currentUser = req.user;
    const { id } = req.params;
    const friend = await User.findById(id)
    const conversation = new Conversation({ user1: { user: currentUser }, user2: { user: friend } })
    await conversation.save()
    currentUser.conversations.push(conversation)
    friend.conversations.push(conversation)
    await currentUser.save()
    await friend.save()
    res.redirect('back')
}))
//

// Send Message
router.post('/sendMessage/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const currentUser = req.user;
    const conversation = await Conversation.findById(id).populate({ path: 'conversations', populate: { path: 'user1', populate: { path: 'user' }}}).populate({ path: 'conversations', populate: { path: 'user2', populate: { path: 'user' }}})
    const newMessage = new Message(req.body)
    conversation.messages.unshift(newMessage)
    console.log(conversation.user1.user)
    console.log(conversation.user2.user)
    console.log(currentUser._id)
    if(`${currentUser._id}` === `${conversation.user1.user}`){
        console.log('user1')
        console.log(conversation.user1.messages)
        conversation.user1.messages.push(newMessage)
        console.log(conversation.user1.messages)
        conversation.save()
        newMessage.save()
        res.redirect('back')
    } else if (`${currentUser._id}` === `${conversation.user2.user}`) {
        console.log('user2')
        console.log(conversation.user2.messages)
        conversation.user2.messages.push(newMessage)
        console.log(conversation.user2.messages)
        conversation.save()
        newMessage.save()
        res.redirect('back')
    }
}))
//

module.exports = router;