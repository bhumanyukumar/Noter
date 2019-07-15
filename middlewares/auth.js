module.exports = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error_msg","UnAuthorized");
    res.redirect("/users/login");
}