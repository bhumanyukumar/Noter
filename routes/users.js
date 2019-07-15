const router = require("express").Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../DB/models/User");
const passport = require("passport");
const mailer = require("../utils/mailer");
//GET Login Route
router.get("/login",(req,res,next)=>{
if(req.isAuthenticated())
return res.redirect("/notes");
next();
},(req, res) => {
    res.render("./pages/login", { title: "Login", user: {} });
})

//POST Login Route
router.post("/login", (req, res,next) => {
    let errors = [];
    if (!validator.isEmail(req.body.email))
        errors.push("Email is not valid");
    if (!req.body.password.trim())
        errors.push("Password cannot be blank");
    if(errors.length>0)
    res.render("./pages/login", { title: "Login", errors, user: req.body });
    else{
        passport.authenticate("local",{
            successRedirect:"/notes",
            failureRedirect:"/users/login",
            failureFlash:true
        })(req,res,next);
    }
})

//GET Register Route
router.get("/register",(req,res,next)=>{
    if(req.isAuthenticated())
    return res.redirect("/notes");
    next();
    }, (req, res) => {
    res.render("./pages/register", { title: "Register", user: {} });
})

//POST Register Form Route
router.post("/register", (req, res) => {
    let errors = [];
    req.body.name = req.body.name.trim();
    if (!req.body.name)
        errors.push("Name is not valid");
    if (!validator.isEmail(req.body.email))
        errors.push("Email is not valid!")
    if (req.body.password.trim() === req.body.password2.trim() === "")
        errors.push("Passwords cannot be blank!");
    else if (req.body.password.trim() != req.body.password2.trim())
        errors.push("Passwords do not match!");
    if (req.body.password.length < 4 || req.body.password2.length < 4)
        errors.push("Password must be at least 4 characters long!");

    if (errors.length > 0) {
        res.render("./pages/register", { title: "Register", errors, user: req.body });
    }
    else {
        User.findOne({ email: req.body.email }).then(u => {
            if (u) {
                let errors = ["Email already exists!"];
                res.render("./pages/register", { title: "Register", errors, user: req.body });
            }
            else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                console.log(newUser);
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (e, hash) => {
                        newUser.password = hash;
                        newUser.save().then(user => {
                            const subject = `Welcome to Noter`;
                            const msg = `Hello ${user.name}, Welcome to Noter.
                            This email is only for testing purpose only.
                            regards,
                            Bhumanyu Kumar`;
                            //Send the email
                            mailer(user.email,subject,msg);
                            req.flash("success_msg", "Registration Successfull! You can login now");
                            res.redirect("/users/login");
                        }).catch(promiseError => {
                            console.log(promiseError);
                            req.flash("error_msg", "Error while creating account!");
                            res.redirect("/users/register");
                        })
                    })
                })
            }
        }).catch(e => {
            req.flash("Internal Error");
            console.log("Error while checking for existing email: ", e);
            res.redirect("/users/register");
        })
    }
})

//POST Logout User
router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success_msg","You are now logged out!");
    res.redirect("/users/login");
})
module.exports = router;