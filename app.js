const express = require("express");
const app = express();
const engine = require("ejs-mate");
const notesRoute = require("./routes/notes");
const publicRoute = require("./routes/public");
const usersRoute = require("./routes/users");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");


app.use(express.static("public"));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:true,
    saveUninitialized:true
}));

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require("./config/passport")(passport);

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user || null;
    next();
})
//Public Route
app.use("/",publicRoute);

//Users Route
app.use("/users",usersRoute);

//Notes Route
app.use("/notes",notesRoute);

//Invalid Url Handler
app.use(require("./middlewares/invalidRouteHandler"));

//Error Handler
app.use(require("./middlewares/errorHandler"));
const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    console.log(`Server is running at ${port}`);
})
