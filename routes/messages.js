const express = require('express')
const router = express.Router();
const catchAsync = require('../functions/catchAsync')
const flash = require('connect-flash')
const passport = require('passport')

const Message = require('../models/messages');

const { isLoggedIn, isAdmin } = require('../functions/middleware');

// Deletes Message
router.delete('/deleteMessage/:id/:groupchatId', isLoggedIn, isAdmin, catchAsync(async(req, res) => {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    res.redirect('back')
}))
//

module.exports = router;