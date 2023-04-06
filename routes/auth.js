 let express = require('express')
 let router = express.Router()
 let User = require('../models/user-DB')
const passport = require('passport');


//this is to register user
router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', async function(req, res){
    try {
        let user = new User({
            username : req.body.username
        })
    
        let registerUser = await User.register(user, req.body.password)
        req.login(registerUser, function(err){
            if(err){
                console.log('error while registering user')
            }
            res.redirect('/jobs')
        })
        
    } catch (error) {
        console.log(error)   
    }
});

//this is to login user
router.get('/login', function(req, res){
    res.render('login')
});

router.post('/login', 
    passport.authenticate('local',{
        failureRedirect : '/login'
    }),
    function(req, res){
        res.redirect('/jobs')
});

//this is to logOut user
router.get('/logout', function(req, res){
    req.logOut(function(err){
        if(err){
            console.log('error while logging out')
        }
        res.redirect('/jobs')
    })
})
module.exports = router;