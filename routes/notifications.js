let express = require("express");
let router = express.Router();
let Notifications = require('../models/noti-DB')
let {isLoggedIn, isAdmin} = require('../middlewares/index')


//index
router.get('/notifications', async function(req, res){
    try {
        let allNotif = await Notifications.find({});
        res.render('index-notif.ejs', {allNotif});
    } catch (error) {
        console.log('error while fetching notifs', error);
    }
})

//new
router.get('/notifications/new', async function(req, res){
    res.render('new-notif')
})

//create
router.post('/notifications', isLoggedIn, isAdmin, async function(req, res){
    try {
        let notif = new Notifications({
            body : req.body.body,
            author: req.body.author
        })
        await notif.save();
        res.redirect('/notifications')
    } catch (error) {
        console.log('error while creating notif', error)
    }
})

//delete
router.delete('/notifications/:id', isLoggedIn, isAdmin ,async function(req, res){
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.redirect('/notifications')
    } catch (error) {
        console.log('error while deleting notif', error)
    }
})

module.exports = router