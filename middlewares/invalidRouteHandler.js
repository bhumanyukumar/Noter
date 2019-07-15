module.exports = (req,res,next)=>{
    const err = new Error("Resource Not Found");
    res.status(404);
    next(err);
}