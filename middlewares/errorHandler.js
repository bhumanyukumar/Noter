module.exports = (err,req,res,next)=>{
    //  console.log("Error code",res.statusCode);
    res.locals.desc=err.message;
    res.locals.status = res.statusCode;
    // console.log("Middleware called");
    // res.send(res.locals);
    res.render("./pages/error",{title:"Error"});
}