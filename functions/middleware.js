const Groupchat = require("../models/groupChats")
const catchAsync = require("./catchAsync")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You Must be Signed In!')
        return res.redirect('/login')
    }
    next()
}

module.exports.isAdmin = catchAsync(async(req, res, next) => {
    const { groupchatId } = req.params;
    const currentUser = req.user;
    const groupchat = await Groupchat.findById(groupchatId).populate('admin');
    if(currentUser.username !== groupchat.admin.username) {
        console.log(req.path, req.originalUrl)
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Admin Auth Required')
        return res.redirect('back')
    }
    next()
})