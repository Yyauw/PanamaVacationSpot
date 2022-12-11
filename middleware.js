function isLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be singed in first!')
        return res.redirect('/login')
    }
    next();
}

module.exports = isLoggedIn;