//middleware to check whether user is logged in or not
//authentication
const isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }
    else{
        console.log('User not loggedIn')
        res.redirect('/login');
    }
}

//authorization 
const isAdmin = function(req, res, next)
{
    if(req.user && req.user.isAdmin)
    {
        next()
    }
    else{
        return res.send('You does not have admin access')
    }
}

module.exports = {
    isLoggedIn,
    isAdmin
}